import { resetPasswordAction } from "@/actions/auth";
import { AppNav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, PageShell, SectionTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/form";

export default function ResetPasswordPage() {
  return (
    <>
      <AppNav />
      <PageShell className="max-w-md">
        <SectionTitle title="Reset Password" />
        <Card>
          <form action={resetPasswordAction} className="grid gap-4">
            <Label label="New password"><Input name="password" type="password" minLength={8} required /></Label>
            <Button>Reset password</Button>
          </form>
        </Card>
      </PageShell>
    </>
  );
}
