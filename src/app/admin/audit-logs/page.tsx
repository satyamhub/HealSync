import { AppNav } from "@/components/nav";
import { PageShell, SectionTitle } from "@/components/ui/card";
import { Role } from "@/generated/prisma/enums";
import { adminContext } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function AuditLogsPage() {
  const { unread } = await adminContext();
  const logs = await prisma.auditLog.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 100 });
  return <><AppNav role={Role.ADMIN} unread={unread} /><PageShell><SectionTitle title="Audit Logs" /><div className="overflow-x-auto rounded-lg border bg-white"><table className="w-full min-w-[760px] text-sm"><tbody>{logs.map((log) => <tr key={log.id} className="border-b"><td className="p-4">{log.createdAt.toLocaleString()}</td><td className="p-4 font-bold">{log.action}</td><td className="p-4">{log.entity}</td><td className="p-4">{log.user?.email || "System"}</td></tr>)}</tbody></table></div></PageShell></>;
}
