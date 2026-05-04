import { NextResponse } from "next/server";
import {
  adminCookieName,
  adminCookieOptions,
  createAdminSession,
  verifyAdminCredentials,
} from "@/app/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const { password, username } = (await request.json()) as {
      password?: string;
      username?: string;
    };

    if (!username || !password || !verifyAdminCredentials(username, password)) {
      return NextResponse.json(
        { message: "Credenciales inválidas." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(
      adminCookieName,
      createAdminSession(username),
      adminCookieOptions(),
    );

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      { message: "No fue posible iniciar sesión." },
      { status: 500 },
    );
  }
}
