import { updateDoctorProfileAction } from "@/actions/manage";
import { AppNav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, PageShell, SectionTitle } from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/form";
import { Role } from "@/generated/prisma/enums";
import { doctorContext } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function DoctorProfilePage() {
  const { doctor, unread } = await doctorContext();
  const departments = await prisma.department.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
  return (
    <>
      <AppNav role={Role.DOCTOR} unread={unread} />
      <PageShell className="max-w-3xl">
        <SectionTitle title="Professional Profile" description="Patients see this information while booking." />
        <Card>
          <form action={updateDoctorProfileAction} className="grid gap-4 md:grid-cols-2">
            <Label label="Department"><Select name="departmentId" defaultValue={doctor.departmentId || ""}>{departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</Select></Label>
            <Label label="Specialization"><Input name="specialization" defaultValue={doctor.specialization || ""} /></Label>
            <Label label="Qualification"><Input name="qualification" defaultValue={doctor.qualification || ""} /></Label>
            <Label label="Experience"><Input name="experience" type="number" defaultValue={doctor.experience} /></Label>
            <Label label="Consultation fee"><Input name="consultationFee" type="number" defaultValue={doctor.consultationFee} /></Label>
            <Label label="License number"><Input name="licenseNumber" defaultValue={doctor.licenseNumber || ""} /></Label>
            <Label label="Languages"><Input name="languages" defaultValue={doctor.languages} /></Label>
            <Label label="Location"><Input name="location" defaultValue={doctor.location || ""} /></Label>
            <Label label="Biography"><Textarea name="biography" defaultValue={doctor.biography || ""} /></Label>
            <Button className="md:col-span-2">Save profile</Button>
          </form>
        </Card>
      </PageShell>
    </>
  );
}
