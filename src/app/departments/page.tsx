import { AppNav } from "@/components/nav";
import { ButtonLink } from "@/components/ui/button";
import { Card, PageShell, SectionTitle } from "@/components/ui/card";
import { departments } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function DepartmentsPage() {
  const items = await departments();
  return (
    <>
      <AppNav />
      <PageShell>
        <SectionTitle title="Departments" description="Browse hospital departments and find approved doctors." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((department) => (
            <Card key={department.id}>
              <p className="text-3xl">{department.icon || "+"}</p>
              <h2 className="mt-3 text-xl font-bold">{department.name}</h2>
              <p className="mt-2 text-sm text-slate-600">{department.description}</p>
              <p className="mt-3 text-sm font-semibold text-teal-800">{department._count.doctors} doctors</p>
              <ButtonLink href={`/doctors?departmentId=${department.id}`} className="mt-4 w-full" variant="secondary">View Doctors</ButtonLink>
            </Card>
          ))}
        </div>
      </PageShell>
    </>
  );
}
