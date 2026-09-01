import { createHmac, timingSafeEqual } from "node:crypto";
import { Role } from "@/generated/prisma/enums";

const SESSION_DAYS = 7;

export const COOKIE_NAME = "healsync_session";

export function sessionExpiresAt() {
  return new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
}

function secret() {
  return process.env.AUTH_SECRET || "development-only-secret-change-me";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function encodeSession(id: string, role: Role) {
  const payload = `${id}.${role}`;
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(token?: string) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [id, role, signature] = parts;
  const expected = sign(`${id}.${role}`);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (!Object.values(Role).includes(role as Role)) return null;
  return { id, role: role as Role };
}
