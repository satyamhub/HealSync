import { NextRequest, NextResponse } from "next/server";
import { Role } from "@/generated/prisma/enums";

const protectedPrefixes = [
  { prefix: "/patient", role: Role.PATIENT },
  { prefix: "/doctor", role: Role.DOCTOR },
  { prefix: "/admin", role: Role.ADMIN },
];

export function proxy(request: NextRequest) {
  const match = protectedPrefixes.find((item) => request.nextUrl.pathname.startsWith(item.prefix));
  if (!match) return NextResponse.next();
  const token = request.cookies.get("healsync_session")?.value;
  const role = token?.split(".")[1] as Role | undefined;
  if (!role || !Object.values(Role).includes(role)) return NextResponse.redirect(new URL("/login", request.url));
  if (role !== match.role) {
    return NextResponse.redirect(new URL(`/${role.toLowerCase()}/dashboard`, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/patient/:path*", "/doctor/:path*", "/admin/:path*"],
};
