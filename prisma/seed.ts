import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import { Role, DoctorApprovalStatus, UserStatus } from "../src/generated/prisma/enums";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL }),
});

const departments = [
  ["Cardiology", "Heart and vascular care.", "Heart"],
  ["Neurology", "Brain, spine, and nerve care.", "Brain"],
  ["Orthopedics", "Bone, joint, and mobility care.", "Bone"],
  ["Dermatology", "Skin, hair, and allergy care.", "Skin"],
  ["Pediatrics", "Child and adolescent health.", "Child"],
  ["General Medicine", "Primary care and internal medicine.", "Plus"],
  ["Gynecology", "Women's health and maternity care.", "Care"],
  ["ENT", "Ear, nose, and throat care.", "ENT"],
  ["Ophthalmology", "Eye care and vision services.", "Eye"],
  ["Dentistry", "Dental care and oral health.", "Tooth"],
  ["Psychiatry", "Mental health and counselling.", "Mind"],
  ["Gastroenterology", "Digestive system and liver care.", "Digest"],
] as const;

const doctorNames = [
  "Dr. Rahul Sharma", "Dr. Ananya Iyer", "Dr. Kabir Mehta", "Dr. Nisha Rao", "Dr. Priya Nair",
  "Dr. Arjun Kapoor", "Dr. Meera Sen", "Dr. Vikram Joshi", "Dr. Farah Khan", "Dr. Dev Patel",
];

async function ensureUser(input: { name: string; email: string; role: Role; passwordHash: string; phone?: string }) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    if (existing.role !== input.role) {
      throw new Error(`Cannot seed ${input.email}: an account with a different role already uses this email.`);
    }
    return { user: existing, created: false };
  }
  const user = await prisma.user.create({
    data: { ...input, status: UserStatus.ACTIVE },
  });
  return { user, created: true };
}

async function main() {
  const passwordHash = await hash("Password@123", 12);
  let newDoctors = 0;
  let newPatients = 0;
  let newDepartments = 0;

  const plannedUsers = [
    ...doctorNames.map((_, i) => ({ email: `doctor${i + 1}@healsync.local`, role: Role.DOCTOR })),
    ...Array.from({ length: 5 }, (_, i) => ({ email: `patient${i + 1}@healsync.local`, role: Role.PATIENT })),
  ];
  const existingPlannedUsers = await prisma.user.findMany({
    where: { email: { in: plannedUsers.map((item) => item.email) } },
    select: { email: true, role: true },
  });
  const roleConflicts = existingPlannedUsers.filter((user) =>
    user.role !== plannedUsers.find((item) => item.email === user.email)?.role,
  );
  if (roleConflicts.length) {
    throw new Error(`Seed stopped before writing data: role conflict for ${roleConflicts.map((user) => user.email).join(", ")}.`);
  }

  const existingAdmin = await prisma.user.findUnique({ where: { email: "admin@healsync.local" } });
  if (!existingAdmin) {
    await ensureUser({ name: "Admin User", email: "admin@healsync.local", role: Role.ADMIN, passwordHash });
  } else if (existingAdmin.role !== Role.ADMIN) {
    console.log("Kept the existing admin@healsync.local account unchanged because it has a different role.");
  }

  const departmentRecords = [];
  for (const [name, description, icon] of departments) {
    const existing = await prisma.department.findUnique({ where: { name } });
    const department = existing ?? await prisma.department.create({ data: { name, description, icon } });
    departmentRecords.push(department);
    if (!existing) newDepartments++;
  }

  for (let i = 0; i < doctorNames.length; i++) {
    const { user, created } = await ensureUser({
      name: doctorNames[i],
      email: `doctor${i + 1}@healsync.local`,
      role: Role.DOCTOR,
      passwordHash,
    });
    const department = departmentRecords[i % departmentRecords.length];
    let doctor = await prisma.doctor.findUnique({ where: { userId: user.id } });
    if (!doctor) {
      doctor = await prisma.doctor.create({
        data: {
          userId: user.id,
          departmentId: department.id,
          specialization: i === 0 ? "Interventional Cardiology" : `${department.name} Specialist`,
          qualification: "MBBS, MD",
          experience: 5 + i,
          biography: "Experienced clinician focused on patient-first care and clear follow-up plans.",
          consultationFee: 500 + i * 75,
          licenseNumber: `MED-${1000 + i}`,
          languages: ["English", "Hindi"],
          location: "HealSync Main Hospital",
          approvalStatus: DoctorApprovalStatus.APPROVED,
        },
      });
    }
    if (created) newDoctors++;

    for (const dayOfWeek of [1, 2, 3, 4, 5, 6]) {
      await prisma.availability.upsert({
        where: { doctorId_dayOfWeek: { doctorId: doctor.id, dayOfWeek } },
        create: { doctorId: doctor.id, dayOfWeek, startTime: "09:00", endTime: dayOfWeek === 6 ? "12:00" : "13:00", slotDuration: 30 },
        update: {},
      });
    }
  }

  for (let i = 0; i < 5; i++) {
    const { user, created } = await ensureUser({
      name: `Sample Patient ${i + 1}`,
      email: `patient${i + 1}@healsync.local`,
      role: Role.PATIENT,
      phone: `90000000${String(i).padStart(2, "0")}`,
      passwordHash,
    });
    await prisma.patient.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        gender: i % 2 ? "Female" : "Male",
        bloodGroup: ["A+", "B+", "O+", "AB+"][i % 4],
        address: `Sample address ${i + 1}`,
        emergencyContact: `98888888${String(i).padStart(2, "0")}`,
      },
      update: {},
    });
    if (created) newPatients++;
  }

  const [doctorCount, patientCount, departmentCount] = await Promise.all([
    prisma.doctor.count(),
    prisma.patient.count(),
    prisma.department.count(),
  ]);
  console.log(`Seed complete. Added ${newDoctors} doctors, ${newPatients} patients, and ${newDepartments} departments.`);
  console.log(`Current totals: ${doctorCount} doctors, ${patientCount} patients, ${departmentCount} departments.`);
  console.log("New demo accounts use password Password@123; existing account passwords were left unchanged.");
}

main().finally(async () => prisma.$disconnect());
