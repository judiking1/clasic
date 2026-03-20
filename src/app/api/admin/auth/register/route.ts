import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";
import { generateId } from "@/lib/utils";
import { getApiUser, unauthorizedResponse, forbiddenResponse, badRequestResponse } from "@/lib/api-auth";
import { logActivity } from "@/lib/activity-logger";
import { z } from "zod/v4";

const registerSchema = z.object({
  email: z.email("올바른 이메일을 입력해주세요"),
  name: z.string().min(1, "이름을 입력해주세요"),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
  role: z.enum(["admin", "superadmin"]).default("admin"),
});

export async function POST(request: NextRequest) {
  const user = await getApiUser(request);
  if (!user) return unauthorizedResponse();
  if (user.role !== "superadmin") return forbiddenResponse();

  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return badRequestResponse(parsed.error.issues[0]?.message || "유효하지 않은 데이터");
    }

    // Check duplicate email
    const existing = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, parsed.data.email))
      .limit(1);
    if (existing[0]) {
      return badRequestResponse("이미 등록된 이메일입니다");
    }

    const now = new Date().toISOString();
    const id = generateId();
    const passwordHash = await hashPassword(parsed.data.password);

    await db.insert(adminUsers).values({
      id,
      email: parsed.data.email,
      name: parsed.data.name,
      passwordHash,
      role: parsed.data.role,
      createdAt: now,
      updatedAt: now,
    });

    await logActivity({
      userId: user.userId,
      userName: user.name,
      action: "create",
      resource: "user",
      resourceId: id,
      details: JSON.stringify({ email: parsed.data.email, role: parsed.data.role }),
    });

    return NextResponse.json(
      { success: true, data: { id, email: parsed.data.email, name: parsed.data.name } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "관리자 등록에 실패했습니다" }, { status: 500 });
  }
}
