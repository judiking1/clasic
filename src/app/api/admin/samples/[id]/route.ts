import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { samples } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getApiUser, unauthorizedResponse, notFoundResponse, badRequestResponse } from "@/lib/api-auth";
import { sampleSchema } from "@/lib/validations/sample";
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
    const result = await db.select().from(samples).where(eq(samples.id, id)).limit(1);
    if (!result[0]) return notFoundResponse();
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("GET sample error:", error);
    return NextResponse.json({ error: "샘플을 불러오지 못했습니다" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getApiUser(request);
  if (!user) return unauthorizedResponse();

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = sampleSchema.safeParse(body);
    if (!parsed.success) {
      return badRequestResponse(parsed.error.issues[0]?.message || "유효하지 않은 데이터");
    }

    await db
      .update(samples)
      .set({ ...parsed.data, imageUrl: body.imageUrl || "" })
      .where(eq(samples.id, id));

    await logActivity({
      userId: user.userId,
      userName: user.name,
      action: "update",
      resource: "sample",
      resourceId: id,
      details: JSON.stringify({ name: parsed.data.name }),
    });

    revalidatePath("/samples");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT sample error:", error);
    return NextResponse.json({ error: "샘플 수정에 실패했습니다" }, { status: 500 });
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
    await db.delete(samples).where(eq(samples.id, id));

    await logActivity({
      userId: user.userId,
      userName: user.name,
      action: "delete",
      resource: "sample",
      resourceId: id,
    });

    revalidatePath("/samples");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE sample error:", error);
    return NextResponse.json({ error: "샘플 삭제에 실패했습니다" }, { status: 500 });
  }
}
