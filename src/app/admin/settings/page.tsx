import { AppNav } from "@/components/nav";
import { Card, PageShell, SectionTitle } from "@/components/ui/card";
import { Role } from "@/generated/prisma/enums";
import { adminContext } from "@/lib/data";

export default async function SettingsPage() {
  const { unread } = await adminContext();
  return <><AppNav role={Role.ADMIN} unread={unread} /><PageShell><SectionTitle title="System Settings" /><Card><p>Hospital working hours and email provider settings are configured through environment variables and doctor availability rules.</p></Card></PageShell></>;
}
