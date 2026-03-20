import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getApiUser, unauthorizedResponse, notFoundResponse } from "@/lib/api-auth";
import { logActivity } from "@/lib/activity-logger";
import { revalidatePath } from "next/cache";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getApiUser(request);
  if (!user) return unauthorizedResponse();

  const { id } = await params;

  try {
    const result = await db.select().from(inquiries).where(eq(inquiries.id, id)).limit(1);
    if (!result[0]) return notFoundResponse();
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("GET inquiry error:", error);
    return NextResponse.json({ error: "문의를 불러오지 못했습니다" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getApiUser(request);
  if (!user) return unauthorizedResponse();

  const { id } = await params;

  try {
    const body = await request.json();

    if (body.isRead !== undefined) {
      await db.update(inquiries).set({ isRead: body.isRead }).where(eq(inquiries.id, id));
    }

    await logActivity({
      userId: user.userId,
      userName: user.name,
      action: "update",
      resource: "inquiry",
      resourceId: id,
      details: JSON.stringify(body),
    });

    revalidatePath("/admin/inquiries");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH inquiry error:", error);
    return NextResponse.json({ error: "문의 수정에 실패했습니다" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getApiUser(request);
  if (!user) return unauthorizedResponse();

  const { id } = await params;

  try {
    await db.delete(inquiries).where(eq(inquiries.id, id));

    await logActivity({
      userId: user.userId,
      userName: user.name,
      action: "delete",
      resource: "inquiry",
      resourceId: id,
    });

    revalidatePath("/admin/inquiries");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE inquiry error:", error);
    return NextResponse.json({ error: "문의 삭제에 실패했습니다" }, { status: 500 });
  }
}
