import { AppointmentStatus, DoctorApprovalStatus, UserStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

const colors: Record<string, string> = {
  REQUESTED: "bg-amber-100 text-amber-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-slate-200 text-slate-700",
  CANCELLED: "bg-rose-100 text-rose-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  PENDING: "bg-amber-100 text-amber-800",
  DISABLED: "bg-rose-100 text-rose-800",
  ACTIVE: "bg-emerald-100 text-emerald-800",
};

export function StatusBadge({ status }: { status: AppointmentStatus | DoctorApprovalStatus | UserStatus | string }) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-bold", colors[status] || "bg-slate-100 text-slate-700")}>{status}</span>;
}
