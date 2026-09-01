"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Role } from "@/generated/prisma/enums";
import { requireRole } from "@/lib/auth";
import {
  acceptAppointment,
  cancelAppointment,
  completeAppointment,
  createAppointment,
  rejectAppointment,
} from "@/lib/appointments";
import { errorMessage } from "@/lib/errors";
import { appointmentCreateSchema, appointmentStatusSchema, consultationSchema } from "@/lib/validators";

export async function createAppointmentAction(formData: FormData) {
  const user = await requireRole(Role.PATIENT);
  const parsed = appointmentCreateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/doctors?error=invalid-appointment");
  try {
    await createAppointment(user.id, parsed.data);
    revalidatePath("/patient/appointments");
    redirect("/patient/appointments?created=1");
  } catch (error) {
    redirect(`/doctors/${parsed.data.doctorId}?error=${encodeURIComponent(errorMessage(error))}`);
  }
}

export async function acceptAppointmentAction(formData: FormData) {
  const user = await requireRole(Role.DOCTOR);
  const parsed = appointmentStatusSchema.parse(Object.fromEntries(formData));
  await acceptAppointment(user.id, parsed.appointmentId);
  revalidatePath("/doctor/appointments");
}

export async function rejectAppointmentAction(formData: FormData) {
  const user = await requireRole(Role.DOCTOR);
  const parsed = appointmentStatusSchema.parse(Object.fromEntries(formData));
  await rejectAppointment(user.id, parsed.appointmentId, parsed.reason);
  revalidatePath("/doctor/appointments");
}

export async function cancelAppointmentAction(formData: FormData) {
  const user = await requireRole(Role.PATIENT, Role.DOCTOR, Role.ADMIN);
  const parsed = appointmentStatusSchema.parse(Object.fromEntries(formData));
  await cancelAppointment(user.id, user.role, parsed.appointmentId, parsed.reason);
  revalidatePath("/");
}

export async function completeAppointmentAction(formData: FormData) {
  const user = await requireRole(Role.DOCTOR);
  const parsed = consultationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/doctor/appointments?error=invalid-consultation");
  try {
    await completeAppointment(user.id, parsed.data);
    revalidatePath("/doctor/appointments");
    redirect("/doctor/appointments?completed=1");
  } catch (error) {
    redirect(`/doctor/appointments?error=${encodeURIComponent(errorMessage(error))}`);
  }
}
