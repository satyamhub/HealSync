import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hash } from "bcryptjs";
import { addDays } from "date-fns";
import { AppointmentStatus, DoctorApprovalStatus, Role, UserStatus } from "../src/generated/prisma/enums";

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || "file:./healsync.db" }),
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
];

const doctorNames = [
  "Dr. Rahul Sharma", "Dr. Ananya Iyer", "Dr. Kabir Mehta", "Dr. Nisha Rao", "Dr. Priya Nair",
  "Dr. Arjun Kapoor", "Dr. Meera Sen", "Dr. Vikram Joshi", "Dr. Farah Khan", "Dr. Dev Patel",
];

async function main() {
  await prisma.consultation.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.doctorLeave.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  const passwordHash = await hash("Password@123", 12);
  const admin = await prisma.user.create({
    data: { name: "Admin User", email: "admin@healsync.local", passwordHash, role: Role.ADMIN, status: UserStatus.ACTIVE },
  });

  const deptRecords = await Promise.all(departments.map(([name, description, icon]) => prisma.department.create({ data: { name, description, icon } })));

  const doctors = [];
  for (let i = 0; i < doctorNames.length; i++) {
    const department = deptRecords[i % deptRecords.length];
    const user = await prisma.user.create({
      data: { name: doctorNames[i], email: `doctor${i + 1}@healsync.local`, passwordHash, role: Role.DOCTOR, status: UserStatus.ACTIVE },
    });
    const doctor = await prisma.doctor.create({
      data: {
        userId: user.id,
        departmentId: department.id,
        specialization: i === 0 ? "Interventional Cardiology" : `${department.name} Specialist`,
        qualification: "MBBS, MD",
        experience: 5 + i,
        biography: "Experienced clinician focused on patient-first care and clear follow-up plans.",
        consultationFee: 500 + i * 75,
        licenseNumber: `MED-${1000 + i}`,
        languages: "English, Hindi",
        location: "HealSync Main Hospital",
        approvalStatus: DoctorApprovalStatus.APPROVED,
      },
    });
    doctors.push(doctor);
    for (const dayOfWeek of [1, 2, 3, 4, 5, 6]) {
      await prisma.availability.create({ data: { doctorId: doctor.id, dayOfWeek, startTime: "09:00", endTime: dayOfWeek === 6 ? "12:00" : "13:00", slotDuration: 30 } });
    }
  }

  const patients = [];
  for (let i = 0; i < 20; i++) {
    const user = await prisma.user.create({
      data: { name: `Patient ${i + 1}`, email: `patient${i + 1}@healsync.local`, phone: `90000000${String(i).padStart(2, "0")}`, passwordHash, role: Role.PATIENT, status: UserStatus.ACTIVE },
    });
    patients.push(await prisma.patient.create({
      data: { userId: user.id, gender: i % 2 ? "Female" : "Male", bloodGroup: ["A+", "B+", "O+", "AB+"][i % 4], address: `Sample address ${i + 1}`, emergencyContact: `98888888${String(i).padStart(2, "0")}` },
    }));
  }

  const statuses = [AppointmentStatus.REQUESTED, AppointmentStatus.ACCEPTED, AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED, AppointmentStatus.REJECTED];
  for (let i = 0; i < 18; i++) {
    const doctor = doctors[i % doctors.length];
    const patient = patients[i % patients.length];
    const date = addDays(new Date(), i - 4);
    date.setHours(0, 0, 0, 0);
    const startTime = `${String(9 + (i % 4)).padStart(2, "0")}:00`;
    const status = statuses[i % statuses.length];
    const activeStatuses: AppointmentStatus[] = [AppointmentStatus.REQUESTED, AppointmentStatus.ACCEPTED, AppointmentStatus.COMPLETED];
    const active = activeStatuses.includes(status);
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        departmentId: doctor.departmentId!,
        appointmentDate: date,
        startTime,
        endTime: `${String(10 + (i % 4)).padStart(2, "0")}:00`,
        reason: "Follow-up consultation and care planning.",
        status,
        bookingKey: active ? `${doctor.id}:${date.toISOString().slice(0, 10)}:${startTime}` : null,
        patientSlotKey: active ? `${patient.id}:${date.toISOString().slice(0, 10)}:${startTime}` : null,
        rejectionReason: status === AppointmentStatus.REJECTED ? "Doctor unavailable for this slot." : null,
        cancellationReason: status === AppointmentStatus.CANCELLED ? "Cancelled by patient." : null,
      },
    });
    if (status === AppointmentStatus.COMPLETED) {
      await prisma.consultation.create({
        data: { appointmentId: appointment.id, doctorId: doctor.id, patientId: patient.id, symptoms: "Routine symptoms", diagnosis: "Stable condition", notes: "Patient advised rest and follow-up.", prescription: "As prescribed by clinician." },
      });
    }
  }

  await prisma.notification.createMany({
    data: [
      { userId: admin.id, title: "Seed complete", message: "Development data is ready." },
      { userId: patients[0].userId, title: "Appointment requested", message: "Your appointment request was submitted.", type: "APPOINTMENT" },
      { userId: doctors[0].userId, title: "New appointment request", message: "A patient requested an appointment.", type: "APPOINTMENT" },
    ],
  });

  console.log("Seed complete.");
  console.log("Admin: admin@healsync.local / Password@123");
  console.log("Doctor: doctor1@healsync.local / Password@123");
  console.log("Patient: patient1@healsync.local / Password@123");
}

main().finally(async () => prisma.$disconnect());
