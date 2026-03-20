"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";
import {
  verifyPasswordHash,
  hashPassword,
  signToken,
  setAuthCookie,
  removeAuthCookie,
  getAuthToken,
  verifyToken,
  type TokenPayload,
} from "@/lib/auth";
import { logActivity } from "@/lib/activity-logger";
import { generateId } from "@/lib/utils";
import type { ActionResult } from "@/types";

// 기본 관리자 계정 정보 (초기 세팅용)
const DEFAULT_ADMIN = {
  email: "admin@clasic.kr",
  name: "최고관리자",
  password: "admin1234",
  role: "superadmin",
};

/**
 * 서버 시작 시 기본 관리자 계정이 없으면 자동 생성
 * - DB에 admin_users가 0명이면 기본 계정 생성
 */
async function ensureDefaultAdmin(): Promise<void> {
  try {
    const result = await db.select({ value: count() }).from(adminUsers);
    const userCount = result[0]?.value ?? 0;

    if (userCount === 0) {
      const now = new Date().toISOString();
      const passwordHash = await hashPassword(DEFAULT_ADMIN.password);

      await db.insert(adminUsers).values({
        id: generateId(),
        email: DEFAULT_ADMIN.email,
        name: DEFAULT_ADMIN.name,
        passwordHash,
        role: DEFAULT_ADMIN.role,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });

      console.log(`[Auth] 기본 관리자 계정 생성됨: ${DEFAULT_ADMIN.email} / ${DEFAULT_ADMIN.password}`);
    }
  } catch {
    // admin_users 테이블이 없을 수 있음 - 무시
  }
}

export async function checkIsAdmin(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;
  const payload = await verifyToken(token);
  return payload !== null;
}

export async function getCurrentAdmin(): Promise<TokenPayload | null> {
  const token = await getAuthToken();
  if (!token) return null;
  return verifyToken(token);
}

export async function loginAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!password) {
    return { success: false, error: "비밀번호를 입력해주세요" };
  }

  if (!email) {
    return { success: false, error: "이메일을 입력해주세요" };
  }

  // 기본 관리자 계정이 없으면 자동 생성
  await ensureDefaultAdmin();

  // DB 기반 로그인
  try {
    const users = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);

    const dbUser = users[0];

    if (!dbUser) {
      return { success: false, error: "이메일 또는 비밀번호가 올바르지 않습니다" };
    }

    if (!dbUser.isActive) {
      return { success: false, error: "비활성화된 계정입니다. 관리자에게 문의하세요" };
    }

    const isValid = await verifyPasswordHash(password, dbUser.passwordHash);
    if (!isValid) {
      return { success: false, error: "이메일 또는 비밀번호가 올바르지 않습니다" };
    }

    const token = await signToken({
      userId: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
    });
    await setAuthCookie(token);

    // Update last login
    await db
      .update(adminUsers)
      .set({ lastLoginAt: new Date().toISOString() })
      .where(eq(adminUsers.id, dbUser.id));

    await logActivity({
      userId: dbUser.id,
      userName: dbUser.name,
      action: "login",
      resource: "auth",
    }).catch(() => {});

    redirect("/admin");
  } catch (error) {
    // redirect()는 내부적으로 에러를 throw하므로 다시 throw
    if (
      error instanceof Error &&
      (error.message === "NEXT_REDIRECT" || error.constructor.name === "RedirectError")
    ) {
      throw error;
    }
    return { success: false, error: "로그인 중 오류가 발생했습니다" };
  }
}

export async function logoutAction(): Promise<void> {
  const token = await getAuthToken();
  if (token) {
    const user = await verifyToken(token);
    if (user) {
      await logActivity({
        userId: user.userId,
        userName: user.name,
        action: "logout",
        resource: "auth",
      }).catch(() => {});
    }
  }

  await removeAuthCookie();
  redirect("/admin/login");
}
