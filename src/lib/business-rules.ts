import { AppointmentStatus, Role } from "@/generated/prisma/enums";

export const activeAppointmentStatuses: AppointmentStatus[] = [
  AppointmentStatus.REQUESTED,
  AppointmentStatus.ACCEPTED,
  AppointmentStatus.COMPLETED,
];

export function appointmentSlotKey(doctorId: string, dateIso: string, startTime: string) {
  return `${doctorId}:${dateIso}:${startTime}`;
}

export function patientSlotConflictKey(patientId: string, dateIso: string, startTime: string) {
  return `${patientId}:${dateIso}:${startTime}`;
}

export function canCancelAppointment(status: AppointmentStatus) {
  const cancellable: AppointmentStatus[] = [AppointmentStatus.REQUESTED, AppointmentStatus.ACCEPTED];
  return cancellable.includes(status);
}

export function canTransitionAppointment(from: AppointmentStatus, to: AppointmentStatus) {
  const allowed: Record<AppointmentStatus, AppointmentStatus[]> = {
    REQUESTED: [AppointmentStatus.ACCEPTED, AppointmentStatus.REJECTED, AppointmentStatus.CANCELLED],
    ACCEPTED: [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED],
    COMPLETED: [],
    REJECTED: [],
    CANCELLED: [],
  };
  return allowed[from].includes(to);
}

export function canAccessPatientRecord(input: {
  role: Role;
  actorUserId: string;
  patientUserId: string;
  assignedDoctorUserIds: string[];
}) {
  if (input.role === Role.ADMIN) return true;
  if (input.role === Role.PATIENT) return input.actorUserId === input.patientUserId;
  if (input.role === Role.DOCTOR) return input.assignedDoctorUserIds.includes(input.actorUserId);
  return false;
}
