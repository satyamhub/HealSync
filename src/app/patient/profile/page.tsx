import { updatePatientProfileAction } from "@/actions/manage";
import { AppNav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, PageShell, SectionTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/form";
import { Role } from "@/generated/prisma/enums";
import { patientContext } from "@/lib/data";

export default async function PatientProfilePage() {
  const { user, patient, unread } = await patientContext();
  return (
    <>
      <AppNav role={Role.PATIENT} unread={unread} />
      <PageShell className="max-w-2xl">
        <SectionTitle title="Patient Profile" description="Keep your contact and basic medical profile current." />
        <Card>
          <form action={updatePatientProfileAction} className="grid gap-4">
            <Label label="Email"><Input value={user.email} disabled /></Label>
            <Label label="Phone"><Input name="phone" defaultValue={user.phone || ""} /></Label>
            <Label label="Date of birth"><Input name="dateOfBirth" type="date" defaultValue={patient.dateOfBirth?.toISOString().slice(0, 10)} /></Label>
            <Label label="Gender"><Input name="gender" defaultValue={patient.gender || ""} /></Label>
            <Label label="Blood group"><Input name="bloodGroup" defaultValue={patient.bloodGroup || ""} /></Label>
            <Label label="Emergency contact"><Input name="emergencyContact" defaultValue={patient.emergencyContact || ""} /></Label>
            <Label label="Address"><Textarea name="address" defaultValue={patient.address || ""} /></Label>
            <Button>Update profile</Button>
          </form>
        </Card>
      </PageShell>
    </>
  );
}
