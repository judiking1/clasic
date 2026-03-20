import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { portfolios, portfolioImages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  getApiUser,
  unauthorizedResponse,
  notFoundResponse,
  badRequestResponse,
} from "@/lib/api-auth";
import { generateId } from "@/lib/utils";
import { portfolioSchema } from "@/lib/validations/portfolio";
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
    const result = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.id, id))
      .limit(1);
    if (!result[0]) return notFoundResponse();

    const images = await db
      .select()
      .from(portfolioImages)
      .where(eq(portfolioImages.portfolioId, id))
      .orderBy(portfolioImages.sortOrder);

    return NextResponse.json({ ...result[0], images });
  } catch (error) {
    console.error("GET portfolio error:", error);
    return NextResponse.json(
      { error: "포트폴리오를 불러오지 못했습니다" },
      { status: 500 }
    );
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
    const parsed = portfolioSchema.safeParse(body);
    if (!parsed.success) {
      return badRequestResponse(
        parsed.error.issues[0]?.message || "유효하지 않은 데이터"
      );
    }

    await db
      .update(portfolios)
      .set({
        ...parsed.data,
        thumbnailUrl: body.thumbnailUrl || "",
        updatedAt: new Date().toISOString(),
      })
      .where(eq(portfolios.id, id));

    // Replace images
    await db
      .delete(portfolioImages)
      .where(eq(portfolioImages.portfolioId, id));

    if (body.images && Array.isArray(body.images)) {
      const imageRecords = body.images.map(
        (img: { url: string; alt?: string }, i: number) => ({
          id: generateId(),
          portfolioId: id,
          imageUrl: img.url,
          altText: img.alt || "",
          sortOrder: i,
        })
      );
      if (imageRecords.length > 0) {
        await db.insert(portfolioImages).values(imageRecords);
      }
    }

    await logActivity({
      userId: user.userId,
      userName: user.name,
      action: "update",
      resource: "portfolio",
      resourceId: id,
      details: JSON.stringify({ title: parsed.data.title }),
    });

    revalidatePath("/portfolio");
    revalidatePath(`/portfolio/${id}`);
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT portfolio error:", error);
    return NextResponse.json(
      { error: "포트폴리오 수정에 실패했습니다" },
      { status: 500 }
    );
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
    await db
      .delete(portfolioImages)
      .where(eq(portfolioImages.portfolioId, id));
    await db.delete(portfolios).where(eq(portfolios.id, id));

    await logActivity({
      userId: user.userId,
      userName: user.name,
      action: "delete",
      resource: "portfolio",
      resourceId: id,
    });

    revalidatePath("/portfolio");
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE portfolio error:", error);
    return NextResponse.json(
      { error: "포트폴리오 삭제에 실패했습니다" },
      { status: 500 }
    );
  }
}
