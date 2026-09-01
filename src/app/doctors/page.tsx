import { Search } from "lucide-react";
import { AppNav } from "@/components/nav";
import { ButtonLink } from "@/components/ui/button";
import { Card, PageShell, SectionTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/form";
import { departments, publicDoctors } from "@/lib/data";
import { formatCurrencyInr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DoctorsPage({ searchParams }: { searchParams: Promise<{ q?: string; departmentId?: string }> }) {
  const params = await searchParams;
  const [doctors, departmentList] = await Promise.all([publicDoctors(params), departments()]);

  return (
    <>
      <AppNav />
      <PageShell>
        <SectionTitle title="Find a Doctor" description="Search by name and filter by active department." />
        <form className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_260px_auto]">
          <Label label="Doctor name">
            <Input name="q" defaultValue={params.q} placeholder="Search doctors" />
          </Label>
          <Label label="Department">
            <Select name="departmentId" defaultValue={params.departmentId || ""}>
              <option value="">All departments</option>
              {departmentList.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
            </Select>
          </Label>
          <button className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-bold text-white">
            <Search className="h-4 w-4" /> Search
          </button>
        </form>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <Card key={doctor.id}>
              <p className="text-xs font-bold uppercase text-teal-700">{doctor.department?.name}</p>
              <h2 className="mt-2 text-xl font-bold">{doctor.user.name}</h2>
              <p className="text-sm text-slate-600">{doctor.specialization || "General consultation"}</p>
              <dl className="mt-4 grid gap-2 text-sm">
                <div className="flex justify-between"><dt>Experience</dt><dd className="font-semibold">{doctor.experience} years</dd></div>
                <div className="flex justify-between"><dt>Fee</dt><dd className="font-semibold">{formatCurrencyInr(doctor.consultationFee)}</dd></div>
              </dl>
              <ButtonLink href={`/doctors/${doctor.id}`} className="mt-5 w-full">View Profile</ButtonLink>
            </Card>
          ))}
        </div>
      </PageShell>
    </>
  );
}
