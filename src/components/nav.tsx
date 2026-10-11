import { Bell, CalendarDays, LogOut, Stethoscope } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAction } from "@/actions/auth";
import { Role } from "@/generated/prisma/enums";
import { Button } from "@/components/ui/button";

const links = {
  PATIENT: [
    ["Dashboard", "/patient/dashboard"],
    ["Doctors", "/patient/doctors"],
    ["Appointments", "/patient/appointments"],
    ["History", "/patient/history"],
    ["Profile", "/patient/profile"],
  ],
  DOCTOR: [
    ["Dashboard", "/doctor/dashboard"],
    ["Appointments", "/doctor/appointments"],
    ["Patients", "/doctor/patients"],
    ["Availability", "/doctor/availability"],
    ["Profile", "/doctor/profile"],
  ],
  ADMIN: [
    ["Dashboard", "/admin/dashboard"],
    ["Doctors", "/admin/doctors"],
    ["Patients", "/admin/patients"],
    ["Departments", "/admin/departments"],
    ["Appointments", "/admin/appointments"],
    ["Users", "/admin/users"],
    ["Audit Logs", "/admin/audit-logs"],
  ],
};

export function AppNav({
  role,
  unread = 0,
  landing = false,
}: {
  role?: Role;
  unread?: number;
  landing?: boolean;
}) {
  return (
    <header
      className={
        landing
          ? "border-b border-[#e6e2d8] bg-white"
          : "border-b border-slate-200 bg-white"
      }
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mr-auto inline-flex items-center gap-2 font-bold text-teal-800"
        >
          <Stethoscope className="h-6 w-6" />
          HealSync
        </Link>
        {landing && !role ? (
          <>
            <nav className="hidden items-center gap-1 md:flex">
              {["Doctors", "Departments", "How It Works", "Care Centers"].map(
                (label) => (
                  <Link
                    key={label}
                    href={
                      label === "Doctors"
                        ? "/doctors"
                        : label === "Departments"
                          ? "/departments"
                          : `/#${label.toLowerCase().replaceAll(" ", "-")}`
                    }
                    className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-[#f5f2eb] hover:text-teal-900"
                  >
                    {label}
                  </Link>
                ),
              )}
            </nav>
            <ButtonLinkShim href="/login" secondary>
              Login
            </ButtonLinkShim>
            <ButtonLinkShim href="/register">Book Appointment</ButtonLinkShim>
          </>
        ) : role ? (
          links[role].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-md px-2.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {label}
            </Link>
          ))
        ) : (
          <>
            <Link
              href="/doctors"
              className="rounded-md px-2.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Doctors
            </Link>
            <Link
              href="/departments"
              className="rounded-md px-2.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Departments
            </Link>
          </>
        )}
        {role ? (
          <>
            <Link
              href={`/${role.toLowerCase()}/notifications`}
              className="relative rounded-md p-2 text-slate-700 hover:bg-slate-100"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unread ? (
                <span className="absolute -right-1 -top-1 rounded-full bg-rose-600 px-1.5 text-xs font-bold text-white">
                  {unread}
                </span>
              ) : null}
            </Link>
            <form action={logoutAction}>
              <Button variant="ghost" className="px-3" aria-label="Log out">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </>
        ) : (
          <>
            <ButtonLinkShim href="/login">Login</ButtonLinkShim>
            <ButtonLinkShim href="/register" secondary>
              <CalendarDays className="h-4 w-4" />
              Register
            </ButtonLinkShim>
          </>
        )}
      </div>
    </header>
  );
}

function ButtonLinkShim({
  href,
  children,
  secondary,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold ${secondary ? "bg-white text-slate-900 ring-1 ring-slate-200" : "bg-teal-700 text-white"}`}
      href={href}
    >
      {children}
    </Link>
  );
}
