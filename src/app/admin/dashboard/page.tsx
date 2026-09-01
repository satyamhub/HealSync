import { AdminCharts } from "@/components/admin-charts";
import { AppNav } from "@/components/nav";
import { StatCard } from "@/components/stat-card";
import { PageShell, SectionTitle } from "@/components/ui/card";
import { Role } from "@/generated/prisma/enums";
import { adminContext } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const { unread } = await adminContext();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [patients, doctors, departments, todayAppointments, pending, completed, cancelled, appointments] = await Promise.all([
    prisma.patient.count(),
    prisma.doctor.count(),
    prisma.department.count(),
    prisma.appointment.count({ where: { appointmentDate: today } }),
    prisma.appointment.count({ where: { status: "REQUESTED" } }),
    prisma.appointment.count({ where: { status: "COMPLETED" } }),
    prisma.appointment.count({ where: { status: "CANCELLED" } }),
    prisma.appointment.findMany({ include: { department: true } }),
  ]);
  const statusData = Object.entries(appointments.reduce<Record<string, number>>((acc, item) => ({ ...acc, [item.status]: (acc[item.status] || 0) + 1 }), {})).map(([name, value]) => ({ name, value }));
  const deptData = Object.entries(appointments.reduce<Record<string, number>>((acc, item) => ({ ...acc, [item.department.name]: (acc[item.department.name] || 0) + 1 }), {})).map(([name, value]) => ({ name, value }));

  return (
    <>
      <AppNav role={Role.ADMIN} unread={unread} />
      <PageShell>
        <SectionTitle title="Hospital Dashboard" description="System-wide operational view." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Patients" value={patients} /><StatCard label="Doctors" value={doctors} /><StatCard label="Departments" value={departments} /><StatCard label="Today's appointments" value={todayAppointments} />
          <StatCard label="Pending" value={pending} /><StatCard label="Completed" value={completed} /><StatCard label="Cancelled" value={cancelled} /><StatCard label="Total appointments" value={appointments.length} />
        </div>
        <AdminCharts deptData={deptData} statusData={statusData} />
      </PageShell>
    </>
  );
}
