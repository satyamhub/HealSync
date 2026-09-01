import Link from "next/link";
import { AppNav } from "@/components/nav";
import { Card, PageShell, SectionTitle } from "@/components/ui/card";
import { Role } from "@/generated/prisma/enums";
import { doctorContext } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function DoctorPatientsPage() {
  const { doctor, unread } = await doctorContext();
  const patients = await prisma.patient.findMany({
    where: { appointments: { some: { doctorId: doctor.id } } },
    include: { user: true, _count: { select: { appointments: true } } },
    orderBy: { user: { name: "asc" } },
  });
  return (
    <>
      <AppNav role={Role.DOCTOR} unread={unread} />
      <PageShell>
        <SectionTitle title="Authorized Patients" description="Only patients with appointments assigned to you are visible." />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {patients.map((patient) => <Link key={patient.id} href={`/doctor/patients/${patient.id}`}><Card><h2 className="font-bold">{patient.user.name}</h2><p className="text-sm text-slate-600">{patient.user.email}</p><p className="mt-2 text-sm font-semibold">{patient._count.appointments} appointments</p></Card></Link>)}
        </div>
      </PageShell>
    </>
  );
}
