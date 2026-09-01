import { Activity, CalendarCheck, ShieldCheck, Users } from "lucide-react";
import { AppNav } from "@/components/nav";
import { StatCard } from "@/components/stat-card";
import { ButtonLink } from "@/components/ui/button";
import { Card, PageShell } from "@/components/ui/card";
import { departments, publicDoctors } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [departmentList, doctors] = await Promise.all([departments(), publicDoctors()]);

  return (
    <>
      <AppNav />
      <section className="bg-white">
        <PageShell className="grid gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase text-teal-700">Hospital appointment management</p>
            <h1 className="max-w-3xl text-4xl font-bold text-slate-950 sm:text-5xl">HealSync keeps doctor appointments clear, secure, and fast.</h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              Patients book available slots, doctors approve requests, and admins manage care operations from one database-backed system.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/register">Book an appointment</ButtonLink>
              <ButtonLink href="/doctors" variant="secondary">Find doctors</ButtonLink>
            </div>
          </div>
          <div className="grid gap-3">
            <Card className="bg-teal-700 text-white">
              <CalendarCheck className="mb-6 h-9 w-9" />
              <p className="text-3xl font-bold">{doctors.length}+ doctors</p>
              <p className="mt-2 text-teal-50">Live availability, approvals, notifications, and medical notes.</p>
            </Card>
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Departments" value={departmentList.length} />
              <StatCard label="Secure roles" value="3" />
            </div>
          </div>
        </PageShell>
      </section>
      <PageShell>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { Icon: ShieldCheck, title: "Server-side RBAC", text: "Patients, doctors, and admins only see authorized records." },
            { Icon: Activity, title: "Slot protection", text: "Requests reserve slots with database constraints to prevent double booking." },
            { Icon: Users, title: "Care workflow", text: "Consultation notes, history, notifications, and approvals stay connected." },
          ].map(({ Icon, title, text }) => (
            <Card key={title}>
              <Icon className="mb-4 h-6 w-6 text-teal-700" />
              <h2 className="font-bold">{title}</h2>
              <p className="mt-2 text-sm text-slate-600">{text}</p>
            </Card>
          ))}
        </div>
      </PageShell>
    </>
  );
}
