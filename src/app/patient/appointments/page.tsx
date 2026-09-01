import { AppointmentTable } from "@/components/appointment-table";
import { AppNav } from "@/components/nav";
import { PageShell, SectionTitle } from "@/components/ui/card";
import { Role } from "@/generated/prisma/enums";
import { patientAppointments, patientContext } from "@/lib/data";

export default async function PatientAppointmentsPage() {
  const { patient, unread } = await patientContext();
  const appointments = await patientAppointments(patient.id);
  return (
    <>
      <AppNav role={Role.PATIENT} unread={unread} />
      <PageShell><SectionTitle title="My Appointments" /><AppointmentTable appointments={appointments} role={Role.PATIENT} /></PageShell>
    </>
  );
}
