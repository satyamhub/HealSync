import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { AppointmentStatus, DoctorApprovalStatus, NotificationType, Role } from "@/generated/prisma/enums";
import { addMinutesToTime, generateSlots, isTimeWithinRule } from "@/lib/availability";
import { appointmentSlotKey, patientSlotConflictKey } from "@/lib/business-rules";
import { errors } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { toDateOnly } from "@/lib/utils";

type Tx = Prisma.TransactionClient;

function slotKey(doctorId: string, date: Date, startTime: string) {
  return appointmentSlotKey(doctorId, date.toISOString().slice(0, 10), startTime);
}

function patientKey(patientId: string, date: Date, startTime: string) {
  return patientSlotConflictKey(patientId, date.toISOString().slice(0, 10), startTime);
}

export async function availableSlots(doctorId: string, dateValue: string | Date) {
  const date = toDateOnly(dateValue);
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
    include: {
      user: true,
      availabilities: true,
      leaves: { where: { date } },
      appointments: {
        where: {
          appointmentDate: date,
          status: { in: [AppointmentStatus.REQUESTED, AppointmentStatus.ACCEPTED, AppointmentStatus.COMPLETED] },
        },
        select: { startTime: true },
      },
    },
  });

  if (!doctor || doctor.user.status !== "ACTIVE" || doctor.approvalStatus !== DoctorApprovalStatus.APPROVED) return [];
  if (doctor.leaves.length > 0) return [];
  const rule = doctor.availabilities.find((item) => item.dayOfWeek === date.getDay() && item.isActive);
  if (!rule) return [];
  const occupied = new Set(doctor.appointments.map((item) => item.startTime));
  return generateSlots(rule).filter((time) => !occupied.has(time));
}

export async function createAppointment(patientUserId: string, input: {
  doctorId: string;
  departmentId: string;
  appointmentDate: string;
  startTime: string;
  reason: string;
}) {
  const appointmentDate = toDateOnly(input.appointmentDate);
  if (appointmentDate < toDateOnly(new Date())) throw errors.badRequest("Past appointment dates cannot be booked.");

  try {
    return await prisma.$transaction(async (tx) => {
      const patient = await tx.patient.findUnique({ where: { userId: patientUserId } });
      if (!patient) throw errors.forbidden();

      const doctor = await tx.doctor.findUnique({
        where: { id: input.doctorId },
        include: { user: true, department: true, availabilities: true, leaves: { where: { date: appointmentDate } } },
      });
      if (!doctor || doctor.user.status !== "ACTIVE" || doctor.approvalStatus !== DoctorApprovalStatus.APPROVED) {
        throw errors.badRequest("Doctor is not available for appointments.");
      }
      if (doctor.departmentId !== input.departmentId || !doctor.department?.isActive) throw errors.badRequest("Invalid department.");
      if (doctor.leaves.length > 0) throw errors.badRequest("Doctor is on leave for this date.");

      const rule = doctor.availabilities.find((item) => item.dayOfWeek === appointmentDate.getDay() && item.isActive);
      if (!rule || !isTimeWithinRule(input.startTime, rule)) throw errors.badRequest("Selected time is outside the doctor's schedule.");

      const bookingKey = slotKey(input.doctorId, appointmentDate, input.startTime);
      const patientSlotKey = patientKey(patient.id, appointmentDate, input.startTime);
      const appointment = await tx.appointment.create({
        data: {
          patientId: patient.id,
          doctorId: input.doctorId,
          departmentId: input.departmentId,
          appointmentDate,
          startTime: input.startTime,
          endTime: addMinutesToTime(input.startTime, rule.slotDuration),
          reason: input.reason,
          status: AppointmentStatus.REQUESTED,
          bookingKey,
          patientSlotKey,
        },
      });

      await tx.notification.createMany({
        data: [
          {
            userId: doctor.userId,
            title: "New appointment request",
            message: "A patient requested a new appointment.",
            type: NotificationType.APPOINTMENT,
          },
          {
            userId: patientUserId,
            title: "Appointment requested",
            message: "Your appointment request has been sent to the doctor.",
            type: NotificationType.APPOINTMENT,
          },
        ],
      });
      await audit(tx, patientUserId, "APPOINTMENT_REQUESTED", "Appointment", appointment.id);
      return appointment;
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw errors.conflict("Sorry, this appointment slot is no longer available. Please select another time.");
    }
    throw error;
  }
}

export async function acceptAppointment(doctorUserId: string, appointmentId: string) {
  return prisma.$transaction(async (tx) => {
    const appointment = await doctorAppointment(tx, doctorUserId, appointmentId);
    if (appointment.status !== AppointmentStatus.REQUESTED) throw errors.badRequest("Only requested appointments can be accepted.");
    const updated = await tx.appointment.update({ where: { id: appointmentId }, data: { status: AppointmentStatus.ACCEPTED } });
    await tx.notification.create({
      data: {
        userId: appointment.patient.userId,
        title: "Appointment accepted",
        message: "Your appointment has been accepted.",
        type: NotificationType.APPOINTMENT,
      },
    });
    await audit(tx, doctorUserId, "APPOINTMENT_ACCEPTED", "Appointment", appointmentId);
    return updated;
  });
}

export async function rejectAppointment(doctorUserId: string, appointmentId: string, reason?: string) {
  return prisma.$transaction(async (tx) => {
    const appointment = await doctorAppointment(tx, doctorUserId, appointmentId);
    if (appointment.status !== AppointmentStatus.REQUESTED) throw errors.badRequest("Only requested appointments can be rejected.");
    const updated = await tx.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.REJECTED, rejectionReason: reason, bookingKey: null, patientSlotKey: null },
    });
    await tx.notification.create({
      data: {
        userId: appointment.patient.userId,
        title: "Appointment rejected",
        message: reason || "Your appointment request was rejected.",
        type: NotificationType.APPOINTMENT,
      },
    });
    await audit(tx, doctorUserId, "APPOINTMENT_REJECTED", "Appointment", appointmentId);
    return updated;
  });
}

export async function cancelAppointment(userId: string, role: Role, appointmentId: string, reason?: string) {
  return prisma.$transaction(async (tx) => {
    const appointment = await tx.appointment.findUnique({
      where: { id: appointmentId },
      include: { patient: true, doctor: true },
    });
    if (!appointment) throw errors.notFound("Appointment not found.");
    if (appointment.status === AppointmentStatus.COMPLETED) throw errors.badRequest("Completed appointments cannot be cancelled.");
    const allowed =
      role === Role.ADMIN ||
      (role === Role.PATIENT && appointment.patient.userId === userId) ||
      (role === Role.DOCTOR && appointment.doctor.userId === userId);
    if (!allowed) throw errors.forbidden();

    const updated = await tx.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.CANCELLED, cancellationReason: reason, bookingKey: null, patientSlotKey: null },
    });
    await tx.notification.createMany({
      data: [
        { userId: appointment.patient.userId, title: "Appointment cancelled", message: reason || "An appointment was cancelled.", type: NotificationType.APPOINTMENT },
        { userId: appointment.doctor.userId, title: "Appointment cancelled", message: reason || "An appointment was cancelled.", type: NotificationType.APPOINTMENT },
      ],
    });
    await audit(tx, userId, "APPOINTMENT_CANCELLED", "Appointment", appointmentId);
    return updated;
  });
}

export async function completeAppointment(doctorUserId: string, input: {
  appointmentId: string;
  symptoms: string;
  diagnosis: string;
  notes?: string;
  prescription?: string;
  followUpDate?: string;
  additionalInstructions?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const appointment = await doctorAppointment(tx, doctorUserId, input.appointmentId);
    if (appointment.status !== AppointmentStatus.ACCEPTED) throw errors.badRequest("Only accepted appointments can be completed.");
    const consultation = await tx.consultation.upsert({
      where: { appointmentId: input.appointmentId },
      create: {
        appointmentId: input.appointmentId,
        doctorId: appointment.doctorId,
        patientId: appointment.patientId,
        symptoms: input.symptoms,
        diagnosis: input.diagnosis,
        notes: input.notes,
        prescription: input.prescription,
        followUpDate: input.followUpDate ? toDateOnly(input.followUpDate) : null,
        additionalInstructions: input.additionalInstructions,
      },
      update: {
        symptoms: input.symptoms,
        diagnosis: input.diagnosis,
        notes: input.notes,
        prescription: input.prescription,
        followUpDate: input.followUpDate ? toDateOnly(input.followUpDate) : null,
        additionalInstructions: input.additionalInstructions,
      },
    });
    await tx.appointment.update({ where: { id: input.appointmentId }, data: { status: AppointmentStatus.COMPLETED } });
    await tx.notification.create({
      data: {
        userId: appointment.patient.userId,
        title: "Consultation completed",
        message: "Your consultation notes are available in your appointment history.",
        type: NotificationType.CONSULTATION,
      },
    });
    await audit(tx, doctorUserId, "APPOINTMENT_COMPLETED", "Appointment", input.appointmentId);
    return consultation;
  });
}

async function doctorAppointment(tx: Tx, doctorUserId: string, appointmentId: string) {
  const appointment = await tx.appointment.findUnique({
    where: { id: appointmentId },
    include: { patient: true, doctor: true },
  });
  if (!appointment) throw errors.notFound("Appointment not found.");
  if (appointment.doctor.userId !== doctorUserId) throw errors.forbidden();
  return appointment;
}

async function audit(tx: Tx, userId: string | null, action: string, entity: string, entityId?: string) {
  await tx.auditLog.create({ data: { userId, action, entity, entityId } });
}
