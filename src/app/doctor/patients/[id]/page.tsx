import { notFound } from "next/navigation";
import { AppointmentTable } from "@/components/appointment-table";
import { AppNav } from "@/components/nav";
import { Card, PageShell, SectionTitle } from "@/components/ui/card";
import { Role } from "@/generated/prisma/enums";
import { doctorContext } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function DoctorPatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { doctor, unread } = await doctorContext();
  const patient = await prisma.patient.findFirst({ where: { id, appointments: { some: { doctorId: doctor.id } } }, include: { user: true } });
  if (!patient) notFound();
  const appointments = await prisma.appointment.findMany({ where: { patientId: id, doctorId: doctor.id }, include: { patient: { include: { user: true } }, department: true }, orderBy: { appointmentDate: "desc" } });
  return (
    <>
      <AppNav role={Role.DOCTOR} unread={unread} />
      <PageShell>
        <SectionTitle title={patient.user.name} description="Authorized appointment history with this doctor." />
        <Card className="mb-4"><p>Email: {patient.user.email}</p><p>Phone: {patient.user.phone || "Not provided"}</p><p>Blood group: {patient.bloodGroup || "Not provided"}</p></Card>
        <AppointmentTable appointments={appointments} role={Role.DOCTOR} />
      </PageShell>
    </>
  );
}
