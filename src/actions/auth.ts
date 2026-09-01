"use server";

import { compare, hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { Role, UserStatus } from "@/generated/prisma/enums";
import { createSession, destroySession } from "@/lib/auth";
import { errors } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/validators";

function roleHome(role: Role) {
  return `/${role.toLowerCase()}/dashboard`;
}

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/register?error=invalid");
  const { name, email, password, phone, role } = parsed.data;

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        role,
        status: UserStatus.ACTIVE,
        passwordHash: await hash(password, 12),
        patient: role === Role.PATIENT ? { create: {} } : undefined,
        doctor: role === Role.DOCTOR ? { create: {} } : undefined,
      },
    });
    await createSession(user.id, user.role);
    redirect(roleHome(user.role));
  } catch {
    redirect("/register?error=exists");
  }
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/login?error=invalid");
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || user.status !== UserStatus.ACTIVE) redirect("/login?error=invalid");
  const ok = await compare(parsed.data.password, user.passwordHash);
  if (!ok) redirect("/login?error=invalid");
  await createSession(user.id, user.role);
  redirect(roleHome(user.role));
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

export async function forgotPasswordAction() {
  redirect("/login?reset=sent");
}

export async function resetPasswordAction() {
  redirect("/login?reset=complete");
}

export async function assertAuthenticatedAction() {
  throw errors.unauthorized();
}
