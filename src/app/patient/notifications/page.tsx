import { markNotificationReadAction } from "@/actions/manage";
import { AppNav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, PageShell, SectionTitle } from "@/components/ui/card";
import { Role } from "@/generated/prisma/enums";
import { patientContext } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function PatientNotificationsPage() {
  const { user, unread } = await patientContext();
  const notifications = await prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 50 });
  return (
    <>
      <AppNav role={Role.PATIENT} unread={unread} />
      <PageShell><SectionTitle title="Notifications" /><NotificationList notifications={notifications} /></PageShell>
    </>
  );
}

export function NotificationList({ notifications }: { notifications: { id: string; title: string; message: string; isRead: boolean }[] }) {
  if (!notifications.length) return <Card>No notifications yet.</Card>;
  return <div className="grid gap-3">{notifications.map((item) => <Card key={item.id} className={item.isRead ? "" : "border-teal-300"}><h2 className="font-bold">{item.title}</h2><p className="mt-1 text-sm text-slate-600">{item.message}</p>{!item.isRead ? <form action={markNotificationReadAction} className="mt-3"><input type="hidden" name="notificationId" value={item.id} /><Button variant="secondary">Mark read</Button></form> : null}</Card>)}</div>;
}
