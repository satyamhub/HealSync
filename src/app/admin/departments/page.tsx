import { createDepartmentAction } from "@/actions/manage";
import { AppNav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, PageShell, SectionTitle } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/form";
import { Role } from "@/generated/prisma/enums";
import { adminContext } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function AdminDepartmentsPage() {
  const { unread } = await adminContext();
  const departments = await prisma.department.findMany({ orderBy: { name: "asc" } });
  return (
    <>
      <AppNav role={Role.ADMIN} unread={unread} />
      <PageShell className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <div><SectionTitle title="Departments" /><Card><form action={createDepartmentAction} className="grid gap-4"><Label label="Name"><Input name="name" required /></Label><Label label="Description"><Textarea name="description" required /></Label><Label label="Icon"><Input name="icon" placeholder="+" /></Label><Label label="Status"><Select name="isActive" defaultValue="true"><option value="true">Active</option><option value="false">Inactive</option></Select></Label><Button>Save department</Button></form></Card></div>
        <div className="grid gap-3">{departments.map((department) => <Card key={department.id}><h2 className="font-bold">{department.icon} {department.name}</h2><p className="text-sm text-slate-600">{department.description}</p><p className="mt-2 text-sm">{department.isActive ? "Active" : "Inactive"}</p></Card>)}</div>
      </PageShell>
    </>
  );
}
