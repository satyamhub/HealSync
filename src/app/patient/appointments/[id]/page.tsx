import { notFound } from "next/navigation";
import { AppNav } from "@/components/nav";
import { StatusBadge } from "@/components/status-badge";
import { Card, PageShell, SectionTitle } from "@/components/ui/card";
import { Role } from "@/generated/prisma/enums";
import { patientContext } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function PatientAppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { patient, unread } = await patientContext();
  const appointment = await prisma.appointment.findFirst({ where: { id, patientId: patient.id }, include: { doctor: { include: { user: true } }, department: true, consultation: true } });
  if (!appointment) notFound();
  return (
    <>
      <AppNav role={Role.PATIENT} unread={unread} />
      <PageShell><SectionTitle title="Appointment Details" /><Card><StatusBadge status={appointment.status} /><h2 className="mt-4 text-xl font-bold">{appointment.doctor.user.name}</h2><p>{appointment.department.name} | {appointment.startTime}</p><p className="mt-3 text-slate-600">{appointment.reason}</p>{appointment.consultation ? <div className="mt-4 border-t pt-4"><h3 className="font-bold">Consultation</h3><p>Diagnosis: {appointment.consultation.diagnosis}</p><p>Prescription: {appointment.consultation.prescription || "None"}</p></div> : null}</Card></PageShell>
    </>
  );
}
