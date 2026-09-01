import { registerAction } from "@/actions/auth";
import { AppNav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, PageShell, SectionTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/form";
import { Role } from "@/generated/prisma/enums";

export default function RegisterPage() {
  return (
    <>
      <AppNav />
      <PageShell className="max-w-md">
        <SectionTitle title="Register" description="Patients can start immediately. Doctors register for admin approval." />
        <Card>
          <form action={registerAction} className="grid gap-4">
            <Label label="Full name"><Input name="name" required /></Label>
            <Label label="Email"><Input name="email" type="email" required /></Label>
            <Label label="Phone"><Input name="phone" /></Label>
            <Label label="Role">
              <Select name="role" defaultValue={Role.PATIENT}>
                <option value={Role.PATIENT}>Patient</option>
                <option value={Role.DOCTOR}>Doctor</option>
              </Select>
            </Label>
            <Label label="Password"><Input name="password" type="password" minLength={8} required /></Label>
            <Button>Create account</Button>
          </form>
        </Card>
      </PageShell>
    </>
  );
}
