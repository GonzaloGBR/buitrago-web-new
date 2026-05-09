import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ADMIN_COOKIE } from "@/lib/admin-constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (pathname.startsWith("/admin/login")) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (token && secret && secret.length >= 16) {
      try {
        await jwtVerify(token, new TextEncoder().encode(secret));
        return NextResponse.redirect(new URL("/admin", request.url));
      } catch {
        /* sesión inválida: mostrar login */
      }
    }
    return NextResponse.next();
  }

  if (!secret || secret.length < 16) {
    return NextResponse.redirect(
      new URL("/admin/login?error=config", request.url)
    );
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL("/admin/login", request.url));
    res.cookies.delete(ADMIN_COOKIE);
    return res;
  }
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
