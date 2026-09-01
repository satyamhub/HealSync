import { acceptAppointmentAction, completeAppointmentAction, rejectAppointmentAction } from "@/actions/appointments";
import { AppNav } from "@/components/nav";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, PageShell, SectionTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/form";
import { AppointmentStatus, Role } from "@/generated/prisma/enums";
import { doctorAppointments, doctorContext } from "@/lib/data";

export default async function DoctorAppointmentsPage() {
  const { doctor, unread } = await doctorContext();
  const appointments = await doctorAppointments(doctor.id);
  return (
    <>
      <AppNav role={Role.DOCTOR} unread={unread} />
      <PageShell>
        <SectionTitle title="Appointment Management" description="Accept, reject, cancel, and complete consultations." />
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">{appointment.patient.user.name}</h2>
                  <p className="text-sm text-slate-600">{appointment.department.name} | {appointment.appointmentDate.toDateString()} | {appointment.startTime}</p>
                  <p className="mt-2 text-sm">{appointment.reason}</p>
                </div>
                <StatusBadge status={appointment.status} />
              </div>
              {appointment.status === AppointmentStatus.REQUESTED ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  <form action={acceptAppointmentAction}><input type="hidden" name="appointmentId" value={appointment.id} /><Button>Accept</Button></form>
                  <form action={rejectAppointmentAction} className="flex gap-2"><input type="hidden" name="appointmentId" value={appointment.id} /><Input name="reason" placeholder="Optional rejection reason" /><Button variant="danger">Reject</Button></form>
                </div>
              ) : null}
              {appointment.status === AppointmentStatus.ACCEPTED ? (
                <form action={completeAppointmentAction} className="mt-4 grid gap-3 rounded-lg bg-slate-50 p-4">
                  <input type="hidden" name="appointmentId" value={appointment.id} />
                  <div className="grid gap-3 md:grid-cols-2">
                    <Label label="Symptoms"><Textarea name="symptoms" required /></Label>
                    <Label label="Diagnosis"><Textarea name="diagnosis" required /></Label>
                    <Label label="Prescription"><Textarea name="prescription" /></Label>
                    <Label label="Notes"><Textarea name="notes" /></Label>
                  </div>
                  <Label label="Follow-up date"><Input type="date" name="followUpDate" /></Label>
                  <Button>Complete Appointment</Button>
                </form>
              ) : null}
            </Card>
          ))}
        </div>
      </PageShell>
    </>
  );
}
