import "server-only";

import { AppointmentStatus, Role } from "@/generated/prisma/enums";
import { requirePageRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toDateOnly } from "@/lib/utils";

export async function unreadCount(userId: string) {
  return prisma.notification.count({ where: { userId, isRead: false } });
}

export async function publicDoctors(searchParams?: { q?: string; departmentId?: string }) {
  return prisma.doctor.findMany({
    where: {
      approvalStatus: "APPROVED",
      user: { status: "ACTIVE", name: searchParams?.q ? { contains: searchParams.q, mode: "insensitive" } : undefined },
      departmentId: searchParams?.departmentId || undefined,
      department: { isActive: true },
    },
    include: { user: true, department: true, availabilities: true },
    orderBy: { user: { name: "asc" } },
  });
}

export async function departments() {
  return prisma.department.findMany({ where: { isActive: true }, include: { _count: { select: { doctors: true } } }, orderBy: { name: "asc" } });
}

export async function patientContext() {
  const user = await requirePageRole(Role.PATIENT);
  const patient = await prisma.patient.findUniqueOrThrow({ where: { userId: user.id }, include: { appointments: true } });
  return { user, patient, unread: await unreadCount(user.id) };
}

export async function doctorContext() {
  const user = await requirePageRole(Role.DOCTOR);
  const doctor = await prisma.doctor.findUniqueOrThrow({ where: { userId: user.id }, include: { department: true } });
  return { user, doctor, unread: await unreadCount(user.id) };
}

export async function adminContext() {
  const user = await requirePageRole(Role.ADMIN);
  return { user, unread: await unreadCount(user.id) };
}

export async function patientAppointments(patientId: string) {
  return prisma.appointment.findMany({
    where: { patientId },
    include: { doctor: { include: { user: true } }, department: true, consultation: true },
    orderBy: [{ appointmentDate: "asc" }, { startTime: "asc" }],
  });
}

export async function doctorAppointments(doctorId: string) {
  return prisma.appointment.findMany({
    where: { doctorId },
    include: { patient: { include: { user: true } }, department: true, consultation: true },
    orderBy: [{ appointmentDate: "asc" }, { startTime: "asc" }],
  });
}

export function appointmentStats(appointments: { status: AppointmentStatus; appointmentDate: Date }[]) {
  const today = toDateOnly(new Date());
  const upcomingStatuses: AppointmentStatus[] = [AppointmentStatus.REQUESTED, AppointmentStatus.ACCEPTED];
  return {
    today: appointments.filter((item) => item.appointmentDate.getTime() === today.getTime()).length,
    pending: appointments.filter((item) => item.status === AppointmentStatus.REQUESTED).length,
    upcoming: appointments.filter((item) => upcomingStatuses.includes(item.status) && item.appointmentDate >= today).length,
    completed: appointments.filter((item) => item.status === AppointmentStatus.COMPLETED).length,
    cancelled: appointments.filter((item) => item.status === AppointmentStatus.CANCELLED).length,
  };
}
