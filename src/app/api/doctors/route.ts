import { NextResponse } from "next/server";
import { publicDoctors } from "@/lib/data";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const doctors = await publicDoctors({ q: url.searchParams.get("q") || undefined, departmentId: url.searchParams.get("departmentId") || undefined });
  return NextResponse.json(doctors);
}
