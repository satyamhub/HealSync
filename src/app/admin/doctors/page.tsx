import { setDoctorApprovalAction } from "@/actions/manage";
import { AppNav } from "@/components/nav";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { PageShell, SectionTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/form";
import { DoctorApprovalStatus, Role } from "@/generated/prisma/enums";
import { adminContext } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function AdminDoctorsPage() {
  const { unread } = await adminContext();
  const doctors = await prisma.doctor.findMany({ include: { user: true, department: true }, orderBy: { createdAt: "desc" } });
  return (
    <>
      <AppNav role={Role.ADMIN} unread={unread} />
      <PageShell><SectionTitle title="Manage Doctors" /><div className="overflow-x-auto rounded-lg border bg-white"><table className="w-full min-w-[760px] text-sm"><tbody>{doctors.map((doctor) => <tr key={doctor.id} className="border-b"><td className="p-4 font-bold">{doctor.user.name}<p className="font-normal text-slate-500">{doctor.user.email}</p></td><td className="p-4">{doctor.department?.name || "Unassigned"}</td><td className="p-4"><StatusBadge status={doctor.approvalStatus} /></td><td className="p-4"><form action={setDoctorApprovalAction} className="flex gap-2"><input type="hidden" name="doctorId" value={doctor.id} /><Select name="approvalStatus" defaultValue={doctor.approvalStatus}>{Object.values(DoctorApprovalStatus).map((status) => <option key={status} value={status}>{status}</option>)}</Select><Button variant="secondary">Save</Button></form></td></tr>)}</tbody></table></div></PageShell>
    </>
  );
}
