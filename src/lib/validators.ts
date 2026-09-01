import { z } from "zod";
import { AppointmentStatus, Role } from "@/generated/prisma/enums";

export const loginSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email().toLowerCase(),
  phone: z.string().min(7).optional().or(z.literal("")),
  password: z.string().min(8),
  role: z.enum([Role.PATIENT, Role.DOCTOR]).default(Role.PATIENT),
});

export const departmentSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(8),
  icon: z.string().optional(),
  isActive: z.coerce.boolean().default(true),
});

export const doctorProfileSchema = z.object({
  departmentId: z.string().min(1),
  specialization: z.string().min(2),
  qualification: z.string().min(2),
  experience: z.coerce.number().int().min(0).max(70),
  biography: z.string().min(10),
  consultationFee: z.coerce.number().int().min(0),
  licenseNumber: z.string().optional(),
  languages: z.string().optional(),
  location: z.string().optional(),
});

export const patientProfileSchema = z.object({
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  bloodGroup: z.string().optional(),
  emergencyContact: z.string().optional(),
  phone: z.string().optional(),
});

export const availabilitySchema = z.object({
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  slotDuration: z.coerce.number().int().min(10).max(120),
  isActive: z.coerce.boolean().default(true),
});

export const appointmentCreateSchema = z.object({
  doctorId: z.string().min(1),
  departmentId: z.string().min(1),
  appointmentDate: z.string().min(10),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  reason: z.string().min(5).max(500),
});

export const appointmentStatusSchema = z.object({
  appointmentId: z.string().min(1),
  reason: z.string().max(500).optional(),
});

export const consultationSchema = z.object({
  appointmentId: z.string().min(1),
  symptoms: z.string().min(2),
  diagnosis: z.string().min(2),
  notes: z.string().optional(),
  prescription: z.string().optional(),
  followUpDate: z.string().optional(),
  additionalInstructions: z.string().optional(),
});

export const appointmentFilterSchema = z.object({
  status: z.nativeEnum(AppointmentStatus).optional(),
  departmentId: z.string().optional(),
  doctorId: z.string().optional(),
  patientId: z.string().optional(),
  date: z.string().optional(),
});
