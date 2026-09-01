import { redirect } from "next/navigation";

export default async function DepartmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/doctors?departmentId=${id}`);
}
