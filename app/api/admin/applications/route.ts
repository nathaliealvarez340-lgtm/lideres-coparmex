import { NextRequest, NextResponse } from "next/server";
import {
  getSessionFromCookieHeader,
  verifyAdminSession,
} from "@/app/lib/admin-auth";
import { listCandidateApplications } from "@/app/lib/application-store";

export async function GET(request: NextRequest) {
  if (!verifyAdminSession(getSessionFromCookieHeader(request.headers.get("cookie")))) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  const applications = await listCandidateApplications();

  return NextResponse.json({ applications });
}
