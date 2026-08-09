import { NextResponse, type NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

import type { AccessTokenPayload } from "@/lib/auth";

const ADMIN_PREFIXES = ["/dashboard", "/products", "/categories", "/orders", "/coupons"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  // Sudah login tapi membuka /login → arahkan ke dashboard.
  if (pathname === "/login") {
    if (token && isValid(token)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!token || !isValid(token)) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Cek role untuk area admin.
  const payload = decode(token);
  const needsAdmin = ADMIN_PREFIXES.some((p) => pathname.startsWith(p));
  if (needsAdmin && payload?.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

function decode(token: string): AccessTokenPayload | undefined {
  try {
    return jwtDecode<AccessTokenPayload>(token);
  } catch {
    return undefined;
  }
}

function isValid(token: string): boolean {
  const payload = decode(token);
  return !!payload && payload.exp * 1000 > Date.now();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/products/:path*",
    "/categories/:path*",
    "/orders/:path*",
    "/coupons/:path*",
  ],
};
