import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/enums";

export async function GET() {
  const user = await requireRole(Role.DOCTOR, Role.ADMIN);
  if (user.role === Role.ADMIN) {
    return NextResponse.json(await prisma.patient.findMany({ include: { user: true } }));
  }
  const doctor = await prisma.doctor.findUniqueOrThrow({ where: { userId: user.id } });
  return NextResponse.json(await prisma.patient.findMany({ where: { appointments: { some: { doctorId: doctor.id } } }, include: { user: true } }));
}
