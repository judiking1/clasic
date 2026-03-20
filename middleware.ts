import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-jwt-secret-change-in-production-please"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and public API routes
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // API routes handle their own auth via getApiUser
  if (pathname.startsWith("/api/admin/")) {
    return NextResponse.next();
  }

  // Protect all other /admin routes
  const token = request.cookies.get("admin-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    await jwtVerify(token, secret);

    // Add user info to response headers for client access
    const response = NextResponse.next();
    return response;
  } catch {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
