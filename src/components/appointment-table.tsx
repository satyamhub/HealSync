import { format } from "date-fns";
import { cancelAppointmentAction } from "@/actions/appointments";
import { AppointmentStatus, Role } from "@/generated/prisma/enums";
import { canCancelAppointment } from "@/lib/business-rules";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";

type Row = {
  id: string;
  appointmentDate: Date;
  startTime: string;
  endTime: string;
  reason: string;
  status: AppointmentStatus;
  department: { name: string };
  doctor?: { user: { name: string } };
  patient?: { user: { name: string } };
};

export function AppointmentTable({ appointments, role }: { appointments: Row[]; role: Role }) {
  if (appointments.length === 0) {
    return <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">No appointments found.</div>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase text-slate-600">
            <tr>
              <th className="px-4 py-3">{role === Role.PATIENT ? "Doctor" : "Patient"}</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {appointments.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 font-semibold">{role === Role.PATIENT ? item.doctor?.user.name : item.patient?.user.name}</td>
                <td className="px-4 py-3">{item.department.name}</td>
                <td className="px-4 py-3">{format(item.appointmentDate, "dd MMM yyyy")}</td>
                <td className="px-4 py-3">{item.startTime} - {item.endTime}</td>
                <td className="max-w-[220px] px-4 py-3 text-slate-600">{item.reason}</td>
                <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                <td className="px-4 py-3">
                  {canCancelAppointment(item.status) ? (
                    <form action={cancelAppointmentAction}>
                      <input type="hidden" name="appointmentId" value={item.id} />
                      <input type="hidden" name="reason" value="Cancelled from dashboard" />
                      <Button variant="secondary" className="min-h-9 px-3 text-xs">Cancel</Button>
                    </form>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
