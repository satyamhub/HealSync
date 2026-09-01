import { AppNav } from "@/components/nav";
import { StatusBadge } from "@/components/status-badge";
import { PageShell, SectionTitle } from "@/components/ui/card";
import { Role } from "@/generated/prisma/enums";
import { adminContext } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const { unread } = await adminContext();
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return <><AppNav role={Role.ADMIN} unread={unread} /><PageShell><SectionTitle title="Users" /><div className="overflow-x-auto rounded-lg border bg-white"><table className="w-full min-w-[700px] text-sm"><tbody>{users.map((user) => <tr key={user.id} className="border-b"><td className="p-4 font-bold">{user.name}<p className="font-normal text-slate-500">{user.email}</p></td><td className="p-4">{user.role}</td><td className="p-4"><StatusBadge status={user.status} /></td><td className="p-4">{user.createdAt.toDateString()}</td></tr>)}</tbody></table></div></PageShell></>;
}
