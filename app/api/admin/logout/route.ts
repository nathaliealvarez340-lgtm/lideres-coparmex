import { NextResponse } from "next/server";
import {
  adminCookieName,
  expiredAdminCookieOptions,
} from "@/app/lib/admin-auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, "", expiredAdminCookieOptions());

  return response;
}
