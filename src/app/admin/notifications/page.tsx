import { NotificationList } from "@/app/patient/notifications/page";
import { AppNav } from "@/components/nav";
import { PageShell, SectionTitle } from "@/components/ui/card";
import { Role } from "@/generated/prisma/enums";
import { adminContext } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function AdminNotificationsPage() {
  const { user, unread } = await adminContext();
  const notifications = await prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 50 });
  return <><AppNav role={Role.ADMIN} unread={unread} /><PageShell><SectionTitle title="Notifications" /><NotificationList notifications={notifications} /></PageShell></>;
}
