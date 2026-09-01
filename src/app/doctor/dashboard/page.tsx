import { CalendarCheck, Clock, UserRoundCheck, Users } from "lucide-react";
import { AppointmentTable } from "@/components/appointment-table";
import { AppNav } from "@/components/nav";
import { StatCard } from "@/components/stat-card";
import { ButtonLink } from "@/components/ui/button";
import { PageShell, SectionTitle } from "@/components/ui/card";
import { Role } from "@/generated/prisma/enums";
import { appointmentStats, doctorAppointments, doctorContext } from "@/lib/data";

export default async function DoctorDashboardPage() {
  const { doctor, unread } = await doctorContext();
  const appointments = await doctorAppointments(doctor.id);
  const stats = appointmentStats(appointments);
  return (
    <>
      <AppNav role={Role.DOCTOR} unread={unread} />
      <PageShell>
        <SectionTitle title="Doctor Dashboard" description="Review today's appointments, pending requests, and patient activity." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Today" value={stats.today} />
          <StatCard label="Pending requests" value={stats.pending} />
          <StatCard label="Upcoming" value={stats.upcoming} />
          <StatCard label="Completed" value={stats.completed} />
        </div>
        <div className="my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ButtonLink href="/doctor/availability" variant="secondary"><Clock className="h-4 w-4" /> Availability</ButtonLink>
          <ButtonLink href="/doctor/appointments"><CalendarCheck className="h-4 w-4" /> Requests</ButtonLink>
          <ButtonLink href="/doctor/patients" variant="secondary"><Users className="h-4 w-4" /> Patients</ButtonLink>
          <ButtonLink href="/doctor/profile" variant="secondary"><UserRoundCheck className="h-4 w-4" /> Profile</ButtonLink>
        </div>
        <AppointmentTable appointments={appointments.slice(0, 8)} role={Role.DOCTOR} />
      </PageShell>
    </>
  );
}
