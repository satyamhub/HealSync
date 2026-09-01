import { addLeaveAction, saveAvailabilityAction } from "@/actions/manage";
import { AppNav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, PageShell, SectionTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/form";
import { Role } from "@/generated/prisma/enums";
import { doctorContext } from "@/lib/data";
import { prisma } from "@/lib/prisma";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function DoctorAvailabilityPage() {
  const { doctor, unread } = await doctorContext();
  const [availability, leaves] = await Promise.all([
    prisma.availability.findMany({ where: { doctorId: doctor.id }, orderBy: { dayOfWeek: "asc" } }),
    prisma.doctorLeave.findMany({ where: { doctorId: doctor.id }, orderBy: { date: "desc" } }),
  ]);
  return (
    <>
      <AppNav role={Role.DOCTOR} unread={unread} />
      <PageShell>
        <SectionTitle title="Manage Availability" description="Configure weekly hours and leave days. Slots are generated automatically." />
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <Card>
            <form action={saveAvailabilityAction} className="grid gap-4 md:grid-cols-5">
              <Label label="Day"><Select name="dayOfWeek">{days.map((day, index) => <option key={day} value={index}>{day}</option>)}</Select></Label>
              <Label label="Start"><Input name="startTime" defaultValue="09:00" /></Label>
              <Label label="End"><Input name="endTime" defaultValue="13:00" /></Label>
              <Label label="Duration"><Input name="slotDuration" type="number" defaultValue={30} /></Label>
              <Label label="Active"><Select name="isActive" defaultValue="true"><option value="true">Active</option><option value="false">Inactive</option></Select></Label>
              <Button className="md:col-span-5">Save availability</Button>
            </form>
            <div className="mt-6 divide-y divide-slate-200">
              {availability.map((item) => <p key={item.id} className="py-3 text-sm"><strong>{days[item.dayOfWeek]}</strong> {item.startTime}-{item.endTime}, {item.slotDuration} min, {item.isActive ? "active" : "inactive"}</p>)}
            </div>
          </Card>
          <Card>
            <h2 className="font-bold">Mark Leave</h2>
            <form action={addLeaveAction} className="mt-4 grid gap-3"><Label label="Date"><Input type="date" name="date" required /></Label><Label label="Reason"><Input name="reason" /></Label><Button variant="secondary">Add leave</Button></form>
            <div className="mt-4 grid gap-2 text-sm">{leaves.map((leave) => <p key={leave.id}>{leave.date.toDateString()} - {leave.reason || "Unavailable"}</p>)}</div>
          </Card>
        </div>
      </PageShell>
    </>
  );
}
