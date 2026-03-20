import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getApiUser, unauthorizedResponse, forbiddenResponse, badRequestResponse } from "@/lib/api-auth";
import { logActivity } from "@/lib/activity-logger";
import { hashPassword } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getApiUser(request);
  if (!user) return unauthorizedResponse();

  const { id } = await params;

  // 비밀번호 변경은 본인 또는 superadmin만 가능
  // 그 외 수정은 superadmin만 가능
  try {
    const body = await request.json();
    const updates: Record<string, unknown> = {};

    // 비밀번호 변경
    if (body.password) {
      // 본인 비밀번호 변경 또는 superadmin의 다른 사용자 비밀번호 리셋
      if (id !== user.userId && user.role !== "superadmin") {
        return forbiddenResponse();
      }
      if (body.password.length < 8) {
        return badRequestResponse("비밀번호는 8자 이상이어야 합니다");
      }
      updates.passwordHash = await hashPassword(body.password);
    }

    // 그 외 필드는 superadmin만
    if (body.isActive !== undefined || body.role || body.name) {
      if (user.role !== "superadmin") return forbiddenResponse();
      if (body.isActive !== undefined) updates.isActive = body.isActive;
      if (body.role) updates.role = body.role;
      if (body.name) updates.name = body.name;
    }

    updates.updatedAt = new Date().toISOString();

    await db.update(adminUsers).set(updates).where(eq(adminUsers.id, id));

    // 로그에서 비밀번호는 제외
    const logDetails = { ...body };
    if (logDetails.password) logDetails.password = "[변경됨]";

    await logActivity({
      userId: user.userId,
      userName: user.name,
      action: "update",
      resource: "user",
      resourceId: id,
      details: JSON.stringify(logDetails),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH user error:", error);
    return NextResponse.json({ error: "사용자 수정에 실패했습니다" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getApiUser(request);
  if (!user) return unauthorizedResponse();
  if (user.role !== "superadmin") return forbiddenResponse();

  const { id } = await params;

  // Prevent self-deletion
  if (id === user.userId) {
    return badRequestResponse("자기 자신을 삭제할 수 없습니다");
  }

  try {
    await db.delete(adminUsers).where(eq(adminUsers.id, id));

    await logActivity({
      userId: user.userId,
      userName: user.name,
      action: "delete",
      resource: "user",
      resourceId: id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE user error:", error);
    return NextResponse.json({ error: "사용자 삭제에 실패했습니다" }, { status: 500 });
  }
}
