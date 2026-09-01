import { describe, expect, it } from "vitest";
import { AppointmentStatus, Role } from "../generated/prisma/enums";
import { addMinutesToTime, generateSlots, isTimeWithinRule } from "../lib/availability";
import {
  activeAppointmentStatuses,
  appointmentSlotKey,
  canAccessPatientRecord,
  canCancelAppointment,
  canTransitionAppointment,
  patientSlotConflictKey,
} from "../lib/business-rules";
import { loginSchema, registerSchema } from "../lib/validators";

describe("authentication validation", () => {
  it("validates registration input and rejects weak passwords", () => {
    expect(registerSchema.safeParse({ name: "Patient One", email: "patient@example.com", password: "Password@123", role: Role.PATIENT }).success).toBe(true);
    expect(registerSchema.safeParse({ name: "P", email: "bad", password: "short", role: Role.PATIENT }).success).toBe(false);
  });

  it("validates login input", () => {
    expect(loginSchema.safeParse({ email: "admin@healsync.local", password: "Password@123" }).success).toBe(true);
    expect(loginSchema.safeParse({ email: "admin@healsync.local", password: "tiny" }).success).toBe(false);
  });
});

describe("availability generation", () => {
  it("generates appointment slots from working hours", () => {
    expect(generateSlots({ startTime: "09:00", endTime: "11:00", slotDuration: 30 })).toEqual(["09:00", "09:30", "10:00", "10:30"]);
  });

  it("checks whether a selected slot belongs to schedule", () => {
    const rule = { startTime: "09:00", endTime: "13:00", slotDuration: 30 };
    expect(isTimeWithinRule("10:30", rule)).toBe(true);
    expect(isTimeWithinRule("10:15", rule)).toBe(false);
    expect(addMinutesToTime("12:30", 30)).toBe("13:00");
  });
});

describe("appointment lifecycle and double-booking keys", () => {
  it("allows only valid lifecycle transitions", () => {
    expect(canTransitionAppointment(AppointmentStatus.REQUESTED, AppointmentStatus.ACCEPTED)).toBe(true);
    expect(canTransitionAppointment(AppointmentStatus.REQUESTED, AppointmentStatus.REJECTED)).toBe(true);
    expect(canTransitionAppointment(AppointmentStatus.ACCEPTED, AppointmentStatus.COMPLETED)).toBe(true);
    expect(canTransitionAppointment(AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED)).toBe(false);
  });

  it("allows cancellation only before completion", () => {
    expect(canCancelAppointment(AppointmentStatus.REQUESTED)).toBe(true);
    expect(canCancelAppointment(AppointmentStatus.ACCEPTED)).toBe(true);
    expect(canCancelAppointment(AppointmentStatus.COMPLETED)).toBe(false);
  });

  it("builds deterministic conflict keys for doctor and patient slots", () => {
    expect(appointmentSlotKey("doctor-1", "2026-09-01", "09:00")).toBe("doctor-1:2026-09-01:09:00");
    expect(patientSlotConflictKey("patient-1", "2026-09-01", "09:00")).toBe("patient-1:2026-09-01:09:00");
    expect(activeAppointmentStatuses).toContain(AppointmentStatus.ACCEPTED);
  });
});

describe("role authorization", () => {
  it("keeps patient records least-privilege", () => {
    expect(canAccessPatientRecord({ role: Role.ADMIN, actorUserId: "admin", patientUserId: "patient", assignedDoctorUserIds: [] })).toBe(true);
    expect(canAccessPatientRecord({ role: Role.PATIENT, actorUserId: "patient", patientUserId: "patient", assignedDoctorUserIds: [] })).toBe(true);
    expect(canAccessPatientRecord({ role: Role.PATIENT, actorUserId: "other", patientUserId: "patient", assignedDoctorUserIds: [] })).toBe(false);
    expect(canAccessPatientRecord({ role: Role.DOCTOR, actorUserId: "doctor", patientUserId: "patient", assignedDoctorUserIds: ["doctor"] })).toBe(true);
    expect(canAccessPatientRecord({ role: Role.DOCTOR, actorUserId: "other-doctor", patientUserId: "patient", assignedDoctorUserIds: ["doctor"] })).toBe(false);
  });
});
