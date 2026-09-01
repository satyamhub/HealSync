import { AppointmentTable } from "@/components/appointment-table";
import { AppNav } from "@/components/nav";
import { PageShell, SectionTitle } from "@/components/ui/card";
import { Role } from "@/generated/prisma/enums";
import { adminContext } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function AdminAppointmentsPage() {
  const { unread } = await adminContext();
  const appointments = await prisma.appointment.findMany({ include: { patient: { include: { user: true } }, department: true }, orderBy: [{ appointmentDate: "desc" }, { startTime: "asc" }] });
  return <><AppNav role={Role.ADMIN} unread={unread} /><PageShell><SectionTitle title="All Appointments" /><AppointmentTable appointments={appointments} role={Role.DOCTOR} /></PageShell></>;
}
