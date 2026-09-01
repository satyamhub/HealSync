import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Role, UserStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { errors } from "@/lib/errors";
import { COOKIE_NAME, decodeSession, encodeSession, sessionExpiresAt } from "@/lib/session";

export async function createSession(userId: string, role: Role) {
  const expiresAt = sessionExpiresAt();
  const session = await prisma.session.create({ data: { userId, expiresAt } });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, encodeSession(session.id, role), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const decoded = decodeSession(cookieStore.get(COOKIE_NAME)?.value);
  if (decoded) await prisma.session.deleteMany({ where: { id: decoded.id } });
  cookieStore.delete(COOKIE_NAME);
}

export async function currentUser() {
  const cookieStore = await cookies();
  const decoded = decodeSession(cookieStore.get(COOKIE_NAME)?.value);
  if (!decoded) return null;

  const session = await prisma.session.findFirst({
    where: { id: decoded.id, expiresAt: { gt: new Date() } },
    include: { user: { include: { patient: true, doctor: true } } },
  });
  if (!session || session.user.status !== UserStatus.ACTIVE) return null;
  return session.user;
}

export async function requireUser() {
  const user = await currentUser();
  if (!user) throw errors.unauthorized();
  return user;
}

export async function requireRole(...roles: Role[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) throw errors.forbidden();
  return user;
}

export async function requirePageRole(...roles: Role[]) {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (!roles.includes(user.role)) redirect(`/${user.role.toLowerCase()}/dashboard`);
  return user;
}

export function readMiddlewareSession(token?: string) {
  return decodeSession(token);
}
