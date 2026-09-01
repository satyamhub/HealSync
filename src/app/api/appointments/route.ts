import { NextResponse } from "next/server";
import { createAppointment } from "@/lib/appointments";
import { requireRole } from "@/lib/auth";
import { errorMessage } from "@/lib/errors";
import { appointmentCreateSchema } from "@/lib/validators";
import { Role } from "@/generated/prisma/enums";

export async function POST(request: Request) {
  try {
    const user = await requireRole(Role.PATIENT);
    const parsed = appointmentCreateSchema.parse(await request.json());
    const appointment = await createAppointment(user.id, parsed);
    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 400 });
  }
}
