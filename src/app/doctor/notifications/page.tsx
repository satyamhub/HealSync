import { AppNav } from "@/components/nav";
import { Role } from "@/generated/prisma/enums";
import { doctorContext } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { PageShell, SectionTitle } from "@/components/ui/card";
import { NotificationList } from "@/app/patient/notifications/page";

export default async function DoctorNotificationsPage() {
  const { user, unread } = await doctorContext();
  const notifications = await prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 50 });
  return <><AppNav role={Role.DOCTOR} unread={unread} /><PageShell><SectionTitle title="Notifications" /><NotificationList notifications={notifications} /></PageShell></>;
}
