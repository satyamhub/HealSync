import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  HeartPulse,
  ShieldCheck,
  Users,
} from "lucide-react";
import { AppNav } from "@/components/nav";
import { StatCard } from "@/components/stat-card";
import { ButtonLink } from "@/components/ui/button";
import { Card, PageShell } from "@/components/ui/card";
import { departments, publicDoctors } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [departmentList, doctors] = await Promise.all([
    departments(),
    publicDoctors(),
  ]);

  return (
    <>
      <AppNav landing />
      <section className="overflow-hidden bg-[#fbf9f5]">
        <PageShell className="grid gap-10 py-8 sm:py-12 lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-16">
          <div className="relative z-10 lg:col-span-6">
            <p className="mb-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-teal-800">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Care, connected
            </p>
            <h1 className="max-w-2xl text-5xl font-bold leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-6xl">
              Better appointments. Better care.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              HealSync brings patients, doctors, and hospital teams into one
              calm, clear workflow from first booking to completed consultation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/register">Book an appointment</ButtonLink>
              <ButtonLink href="/doctors" variant="secondary">
                Find a doctor <ArrowUpRight className="h-4 w-4" />
              </ButtonLink>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-600">
              {[
                "Secure by design",
                "Live availability",
                "Human-centered care",
              ].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-700" />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="relative min-h-[460px] overflow-hidden rounded-2xl border border-[#e6e2d8] bg-white p-2 shadow-[0_2px_8px_-2px_rgba(19,78,72,0.06)] lg:col-span-6">
            <div
              className="absolute inset-2 rounded-xl bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=85')",
              }}
              role="img"
              aria-label="Doctor speaking with a patient in a bright clinic"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/5 to-transparent" />
            <div className="absolute left-6 top-6 flex items-center gap-3 rounded-xl border border-[#e6e2d8] bg-white/95 px-4 py-3 shadow-xl shadow-teal-900/10 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Today&apos;s care
                  </p>
                  <p className="text-xs font-bold text-teal-900">
                    {doctors.length + 10} active clinics · Live
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-6 right-6 w-[min(270px,calc(100%-3rem))] rounded-xl border border-[#e6e2d8] bg-white/95 p-4 shadow-xl shadow-teal-900/10 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-teal-100 px-2 py-1 text-[11px] font-bold text-teal-900">
                  ✓ Confirmed
                </span>
                <span className="text-[11px] text-slate-500">10:30 AM</span>
              </div>
              <p className="mt-3 text-sm font-bold text-slate-950">
                Dr. {doctors[0]?.user.name || "Care team"}
              </p>
              <p className="text-[11px] text-slate-500">
                {doctors[0]?.specialization || "General Medicine"} ·
                Consultation
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-[#f1efe9] pt-2 text-[11px]">
                <span className="text-slate-500">Patient intake</span>
                <span className="font-bold text-teal-900">
                  Ready in Room 4B
                </span>
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6 text-white sm:bottom-8 sm:left-8 sm:right-8">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-200">
                A clearer way forward
              </p>
              <p className="mt-2 max-w-md text-2xl font-bold leading-tight sm:text-3xl">
                Every appointment has a next step.
              </p>
            </div>
          </div>
        </PageShell>
      </section>
      <section className="border-y border-[#e6e2d8] bg-white">
        <PageShell className="grid grid-cols-2 gap-6 py-8 text-center sm:grid-cols-4 sm:text-left">
          {[
            [doctors.length + "+", "Certified specialists"],
            [departmentList.length, "Integrated departments"],
            ["99.8%", "On-time consultations"],
            ["100%", "Role-protected"],
          ].map(([value, label], index) => (
            <div
              key={label}
              className={index < 3 ? "border-r border-[#f1efe9]" : ""}
            >
              <p
                className={`text-3xl font-bold tracking-tight ${index === 2 ? "text-orange-600" : "text-teal-900"}`}
              >
                {value}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                {label}
              </p>
            </div>
          ))}
        </PageShell>
      </section>
      <section className="bg-[#fbf9f5]" id="doctors">
        <PageShell className="py-12 sm:py-16">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-600">
                Meet your care team
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Specialists who make time for you.
              </h2>
            </div>
            <ButtonLink href="/doctors" variant="secondary">
              View all doctors <ArrowUpRight className="h-4 w-4" />
            </ButtonLink>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {doctors.slice(0, 3).map((doctor) => (
              <Card
                key={doctor.id}
                className="flex items-center gap-4 border-[#e6e2d8] p-4 shadow-[0_2px_8px_-2px_rgba(19,78,72,0.05)]"
              >
                <div
                  className="h-14 w-14 shrink-0 rounded-full bg-cover bg-center bg-slate-200"
                  style={{
                    backgroundImage: `url('${doctor.profilePhoto || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=85"}')`,
                  }}
                  role="img"
                  aria-label={`${doctor.user.name}, ${doctor.specialization || "medical specialist"}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="truncate font-bold text-slate-950">
                        {doctor.user.name}
                      </h3>
                      <p className="mt-1 text-sm text-teal-700">
                        {doctor.specialization || "Medical specialist"}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-orange-600">
                      ★ 4.9
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                    <Clock3 className="h-4 w-4 text-teal-700" />{" "}
                    {doctor.experience} years experience
                  </div>
                  <span className="mt-2 inline-flex rounded-full bg-[#f5f2eb] px-2 py-1 text-[11px] font-bold text-teal-900">
                    Next: Tomorrow 09:30
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </PageShell>
      </section>
      <section className="bg-white" id="how-it-works">
        <PageShell className="py-12 sm:py-16">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-600">
                One connected system
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Built around the care journey.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-slate-500">
              From finding the right doctor to following up after a visit, every
              detail stays in sync.
            </p>
          </div>
          <div className="mb-10 grid gap-3 sm:grid-cols-3">
            <StatCard label="Available doctors" value={`${doctors.length}+`} />
            <StatCard label="Departments" value={departmentList.length} />
            <StatCard label="Protected roles" value="3" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                Icon: ShieldCheck,
                title: "Server-side RBAC",
                text: "Patients, doctors, and admins only see authorized records.",
              },
              {
                Icon: Activity,
                title: "Slot protection",
                text: "Requests reserve slots with database constraints to prevent double booking.",
              },
              {
                Icon: Users,
                title: "Care workflow",
                text: "Consultation notes, history, notifications, and approvals stay connected.",
              },
            ].map(({ Icon, title, text }) => (
              <Card
                key={title}
                className="border-slate-200/80 p-6 shadow-none transition-transform hover:-translate-y-1"
              >
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="font-bold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </Card>
            ))}
          </div>
        </PageShell>
      </section>
      <section className="bg-[#fbf9f5]" id="book">
        <PageShell className="mb-12 flex flex-col gap-6 rounded-2xl bg-teal-900 py-12 text-white shadow-[0_2px_8px_-2px_rgba(19,78,72,0.08)] sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-14">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white">
              <HeartPulse className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-200">
                Need care today?
              </p>
              <h2 className="mt-1 text-2xl font-bold">
                Find the right appointment without the runaround.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-teal-100">
                Browse trusted specialists, compare availability, and keep every
                next step in one place.
              </p>
            </div>
          </div>
          <ButtonLink
            href="/register"
            className="shrink-0 bg-orange-500 text-white hover:bg-orange-600"
          >
            Get started <ArrowUpRight className="h-4 w-4" />
          </ButtonLink>
        </PageShell>
      </section>
      <section
        className="border-y border-red-200 bg-red-50 px-4 py-3 text-center text-xs font-medium text-red-800"
        id="emergency"
      >
        <span className="font-bold">Emergency Notice:</span> If you are
        experiencing a life-threatening medical emergency, call 911 or visit the
        nearest emergency room immediately.
      </section>
      <footer className="border-t border-[#e6e2d8] bg-[#f5f2eb] text-slate-600">
        <PageShell className="flex flex-col gap-3 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="font-bold text-teal-900">HealSync</span>
          <span>
            © 2026 HealSync Healthcare Systems. Human-centered clinical care.
          </span>
          <div className="flex gap-4 underline decoration-slate-300 underline-offset-4">
            <a href="#privacy">Privacy</a>
            <a href="#support">Contact support</a>
          </div>
        </PageShell>
      </footer>
    </>
  );
}
