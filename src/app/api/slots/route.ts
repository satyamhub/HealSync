import { NextResponse } from "next/server";
import { availableSlots } from "@/lib/appointments";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const doctorId = url.searchParams.get("doctorId");
  const date = url.searchParams.get("date");
  if (!doctorId || !date) return NextResponse.json({ error: "doctorId and date are required." }, { status: 400 });
  return NextResponse.json({ slots: await availableSlots(doctorId, date) });
}
