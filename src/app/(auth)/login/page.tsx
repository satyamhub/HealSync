import { loginAction } from "@/actions/auth";
import { AppNav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, PageShell, SectionTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/form";

export default function LoginPage() {
  return (
    <>
      <AppNav />
      <PageShell className="max-w-md">
        <SectionTitle title="Login" description="Access your role-specific dashboard." />
        <Card>
          <form action={loginAction} className="grid gap-4">
            <Label label="Email"><Input name="email" type="email" required /></Label>
            <Label label="Password"><Input name="password" type="password" minLength={8} required /></Label>
            <Button>Login</Button>
          </form>
        </Card>
      </PageShell>
    </>
  );
}
