import { readFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import {
  getSessionFromCookieHeader,
  verifyAdminSession,
} from "@/app/lib/admin-auth";
import { getCandidateCvPath } from "@/app/lib/application-store";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!verifyAdminSession(getSessionFromCookieHeader(request.headers.get("cookie")))) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const cv = await getCandidateCvPath(id);

  if (!cv) {
    return NextResponse.json({ message: "CV no encontrado." }, { status: 404 });
  }

  const file = await readFile(cv.filePath);
  const contentType = cv.candidate.cvFileName.toLowerCase().endsWith(".png")
    ? "image/png"
    : "application/pdf";

  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `inline; filename="${encodeURIComponent(cv.candidate.cvFileName)}"`,
      "Content-Type": contentType,
    },
  });
}
