"use server";

import { revalidatePath } from "next/cache";
import { DoctorApprovalStatus, Role, UserStatus } from "@/generated/prisma/enums";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toDateOnly } from "@/lib/utils";
import { availabilitySchema, departmentSchema, doctorProfileSchema, patientProfileSchema } from "@/lib/validators";

export async function updatePatientProfileAction(formData: FormData) {
  const user = await requireRole(Role.PATIENT);
  const data = patientProfileSchema.parse(Object.fromEntries(formData));
  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { phone: data.phone || null } }),
    prisma.patient.update({
      where: { userId: user.id },
      data: {
        dateOfBirth: data.dateOfBirth ? toDateOnly(data.dateOfBirth) : null,
        gender: data.gender || null,
        address: data.address || null,
        bloodGroup: data.bloodGroup || null,
        emergencyContact: data.emergencyContact || null,
      },
    }),
  ]);
  revalidatePath("/patient/profile");
}

export async function updateDoctorProfileAction(formData: FormData) {
  const user = await requireRole(Role.DOCTOR);
  const data = doctorProfileSchema.parse(Object.fromEntries(formData));
  await prisma.doctor.update({
    where: { userId: user.id },
    data: {
      ...data,
      languages: data.languages?.split(",").map((item) => item.trim()).filter(Boolean).join(", ") || "",
    },
  });
  revalidatePath("/doctor/profile");
}

export async function saveAvailabilityAction(formData: FormData) {
  const user = await requireRole(Role.DOCTOR);
  const doctor = await prisma.doctor.findUniqueOrThrow({ where: { userId: user.id } });
  const data = availabilitySchema.parse(Object.fromEntries(formData));
  await prisma.availability.upsert({
    where: { doctorId_dayOfWeek: { doctorId: doctor.id, dayOfWeek: data.dayOfWeek } },
    create: { doctorId: doctor.id, ...data },
    update: data,
  });
  revalidatePath("/doctor/availability");
}

export async function addLeaveAction(formData: FormData) {
  const user = await requireRole(Role.DOCTOR);
  const doctor = await prisma.doctor.findUniqueOrThrow({ where: { userId: user.id } });
  const date = String(formData.get("date"));
  await prisma.doctorLeave.upsert({
    where: { doctorId_date: { doctorId: doctor.id, date: toDateOnly(date) } },
    create: { doctorId: doctor.id, date: toDateOnly(date), reason: String(formData.get("reason") || "") },
    update: { reason: String(formData.get("reason") || "") },
  });
  revalidatePath("/doctor/availability");
}

export async function createDepartmentAction(formData: FormData) {
  const user = await requireRole(Role.ADMIN);
  const data = departmentSchema.parse(Object.fromEntries(formData));
  const department = await prisma.department.upsert({
    where: { name: data.name },
    create: data,
    update: data,
  });
  await prisma.auditLog.create({ data: { userId: user.id, action: "DEPARTMENT_SAVED", entity: "Department", entityId: department.id } });
  revalidatePath("/admin/departments");
}

export async function setDoctorApprovalAction(formData: FormData) {
  const user = await requireRole(Role.ADMIN);
  const doctorId = String(formData.get("doctorId"));
  const approvalStatus = String(formData.get("approvalStatus")) as DoctorApprovalStatus;
  const status = approvalStatus === DoctorApprovalStatus.DISABLED ? UserStatus.DISABLED : UserStatus.ACTIVE;
  const doctor = await prisma.doctor.update({
    where: { id: doctorId },
    data: { approvalStatus, user: { update: { status } } },
  });
  await prisma.auditLog.create({ data: { userId: user.id, action: "DOCTOR_STATUS_CHANGED", entity: "Doctor", entityId: doctor.id } });
  revalidatePath("/admin/doctors");
}

export async function markNotificationReadAction(formData: FormData) {
  const user = await requireRole(Role.PATIENT, Role.DOCTOR, Role.ADMIN);
  await prisma.notification.updateMany({
    where: { id: String(formData.get("notificationId")), userId: user.id },
    data: { isRead: true },
  });
  revalidatePath("/");
}
