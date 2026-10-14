import { format } from "date-fns";
import { notFound } from "next/navigation";
import { createAppointmentAction } from "@/actions/appointments";
import { AppNav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, PageShell, SectionTitle } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/form";
import { availableSlots } from "@/lib/appointments";
import { prisma } from "@/lib/prisma";
import { dateInputValue, formatCurrencyInr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DoctorProfilePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ date?: string }> }) {
  const { id } = await params;
  const { date = dateInputValue() } = await searchParams;
  const doctor = await prisma.doctor.findUnique({ where: { id }, include: { user: true, department: true, availabilities: true } });
  if (!doctor || doctor.approvalStatus !== "APPROVED") notFound();
  const slots = await availableSlots(id, date);

  return (
    <>
      <AppNav />
      <PageShell className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div>
          <SectionTitle title={doctor.user.name} description={doctor.biography || "Trusted care with transparent availability and appointment approval."} />
          <Card>
            <dl className="grid gap-4 sm:grid-cols-2">
              <Info label="Department" value={doctor.department?.name || "Not assigned"} />
              <Info label="Specialization" value={doctor.specialization || "General Medicine"} />
              <Info label="Experience" value={`${doctor.experience} years`} />
              <Info label="Qualification" value={doctor.qualification || "Not provided"} />
              <Info label="Consultation Fee" value={formatCurrencyInr(doctor.consultationFee)} />
              <Info label="Languages" value={doctor.languages || "English"} />
              <Info label="Location" value={doctor.location || "Main hospital"} />
            </dl>
          </Card>
          <Card className="mt-4">
            <h2 className="font-bold">Available Days</h2>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              {doctor.availabilities.filter((item) => item.isActive).map((item) => (
                <span key={item.id} className="rounded-full bg-teal-50 px-3 py-1 font-medium text-teal-800">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][item.dayOfWeek]} {item.startTime}-{item.endTime}
                </span>
              ))}
            </div>
          </Card>
        </div>
        <Card>
          <h2 className="text-lg font-bold">Book Appointment</h2>
          <form className="mt-4 grid gap-4">
            <Label label="Appointment date"><Input name="date" type="date" defaultValue={date} min={dateInputValue()} /></Label>
            <Button variant="secondary">Check slots</Button>
          </form>
          <form action={createAppointmentAction} className="mt-4 grid gap-4">
            <input type="hidden" name="doctorId" value={doctor.id} />
            <input type="hidden" name="departmentId" value={doctor.departmentId || ""} />
            <input type="hidden" name="appointmentDate" value={date} />
            <Label label={`Available slots for ${format(new Date(`${date}T00:00:00`), "dd MMM yyyy")}`}>
              <Select name="startTime" required>
                {slots.length ? slots.map((slot) => <option key={slot} value={slot}>{slot}</option>) : <option value="">No slots available</option>}
              </Select>
            </Label>
            <Label label="Reason for visit"><Textarea name="reason" required placeholder="Describe symptoms or appointment reason" /></Label>
            <Button disabled={!slots.length}>Request Appointment</Button>
          </form>
        </Card>
      </PageShell>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-sm text-slate-500">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div>;
}
