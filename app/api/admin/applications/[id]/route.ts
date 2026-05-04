import { NextRequest, NextResponse } from "next/server";
import {
  getSessionFromCookieHeader,
  verifyAdminSession,
} from "@/app/lib/admin-auth";
import {
  CandidateStatus,
  updateCandidateApplication,
} from "@/app/lib/application-store";

const allowedStatuses: CandidateStatus[] = [
  "pending",
  "reviewed",
  "shortlisted",
  "rejected",
];

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!verifyAdminSession(getSessionFromCookieHeader(request.headers.get("cookie")))) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as {
    adminNotes?: string;
    status?: CandidateStatus;
  };

  if (body.status && !allowedStatuses.includes(body.status)) {
    return NextResponse.json({ message: "Estado inválido." }, { status: 400 });
  }

  const updates: {
    adminNotes?: string;
    status?: CandidateStatus;
  } = {};

  if (typeof body.adminNotes === "string") {
    updates.adminNotes = body.adminNotes;
  }

  if (body.status) {
    updates.status = body.status;
  }

  const application = await updateCandidateApplication(id, updates);

  if (!application) {
    return NextResponse.json(
      { message: "Postulación no encontrada." },
      { status: 404 },
    );
  }

  return NextResponse.json({ application });
}
