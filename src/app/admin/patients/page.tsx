import { AppNav } from "@/components/nav";
import { Card, PageShell, SectionTitle } from "@/components/ui/card";
import { Role } from "@/generated/prisma/enums";
import { adminContext } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function AdminPatientsPage() {
  const { unread } = await adminContext();
  const patients = await prisma.patient.findMany({ include: { user: true, _count: { select: { appointments: true } } }, orderBy: { user: { name: "asc" } } });
  return <><AppNav role={Role.ADMIN} unread={unread} /><PageShell><SectionTitle title="Manage Patients" /><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{patients.map((patient) => <Card key={patient.id}><h2 className="font-bold">{patient.user.name}</h2><p className="text-sm text-slate-600">{patient.user.email}</p><p className="mt-2 text-sm">{patient._count.appointments} appointments</p></Card>)}</div></PageShell></>;
}
