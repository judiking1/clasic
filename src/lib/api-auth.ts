import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import type { TokenPayload } from "@/lib/auth";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-jwt-secret-change-in-production-please"
);

export async function getApiUser(
  request: NextRequest
): Promise<TokenPayload | null> {
  const token = request.cookies.get("admin-token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
}

export function forbiddenResponse() {
  return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 });
}

export function badRequestResponse(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

export function notFoundResponse() {
  return NextResponse.json(
    { error: "리소스를 찾을 수 없습니다" },
    { status: 404 }
  );
}
