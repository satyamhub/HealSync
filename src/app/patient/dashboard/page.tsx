import { CalendarDays, ClipboardList, History, Search } from "lucide-react";
import { AppointmentTable } from "@/components/appointment-table";
import { AppNav } from "@/components/nav";
import { StatCard } from "@/components/stat-card";
import { ButtonLink } from "@/components/ui/button";
import { Card, PageShell, SectionTitle } from "@/components/ui/card";
import { Role } from "@/generated/prisma/enums";
import { appointmentStats, patientAppointments, patientContext } from "@/lib/data";

export default async function PatientDashboardPage() {
  const { user, patient, unread } = await patientContext();
  const appointments = await patientAppointments(patient.id);
  const stats = appointmentStats(appointments);
  const upcoming = appointments.filter((item) => ["REQUESTED", "ACCEPTED"].includes(item.status)).slice(0, 3);

  return (
    <>
      <AppNav role={Role.PATIENT} unread={unread} />
      <PageShell>
        <SectionTitle title={`Good day, ${user.name}`} description="Track upcoming care, appointment requests, and consultation history." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Upcoming" value={stats.upcoming} />
          <StatCard label="Pending" value={stats.pending} />
          <StatCard label="Completed" value={stats.completed} />
          <StatCard label="Cancelled" value={stats.cancelled} />
        </div>
        <div className="my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ButtonLink href="/patient/doctors" variant="secondary"><Search className="h-4 w-4" /> Find Doctor</ButtonLink>
          <ButtonLink href="/doctors"><CalendarDays className="h-4 w-4" /> Book</ButtonLink>
          <ButtonLink href="/departments" variant="secondary"><ClipboardList className="h-4 w-4" /> Departments</ButtonLink>
          <ButtonLink href="/patient/history" variant="secondary"><History className="h-4 w-4" /> History</ButtonLink>
        </div>
        <Card className="mb-4"><h2 className="mb-3 font-bold">Upcoming Appointment</h2><AppointmentTable appointments={upcoming} role={Role.PATIENT} /></Card>
      </PageShell>
    </>
  );
}
