import { forgotPasswordAction } from "@/actions/auth";
import { AppNav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, PageShell, SectionTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/form";

export default function ForgotPasswordPage() {
  return (
    <>
      <AppNav />
      <PageShell className="max-w-md">
        <SectionTitle title="Forgot Password" />
        <Card>
          <form action={forgotPasswordAction} className="grid gap-4">
            <Label label="Email"><Input name="email" type="email" required /></Label>
            <Button>Send reset link</Button>
          </form>
        </Card>
      </PageShell>
    </>
  );
}
