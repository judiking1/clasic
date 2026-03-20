import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema";
import { eq, desc, asc, like, or, and, sql, inArray } from "drizzle-orm";
import { getApiUser, unauthorizedResponse, badRequestResponse } from "@/lib/api-auth";
import { getPaginationValues } from "@/lib/utils";
import { logActivity } from "@/lib/activity-logger";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const user = await getApiUser(request);
  if (!user) return unauthorizedResponse();

  const { searchParams } = request.nextUrl;
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 20;
  const search = searchParams.get("search") || undefined;
  const inquiryType = searchParams.get("inquiryType") || undefined;
  const isRead = searchParams.get("isRead");
  const sortBy = searchParams.get("sortBy") || undefined;
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  const { offset } = getPaginationValues(page, pageSize);

  try {
    const conditions = [];
    if (isRead !== null && isRead !== undefined && isRead !== "") {
      conditions.push(eq(inquiries.isRead, isRead === "true"));
    }
    if (inquiryType && inquiryType !== "all") {
      conditions.push(eq(inquiries.inquiryType, inquiryType));
    }
    if (search) {
      const s = `%${search}%`;
      conditions.push(
        or(
          like(inquiries.name, s),
          like(inquiries.phone, s),
          like(inquiries.message, s)
        )!
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(inquiries)
      .where(where);
    const total = countResult?.count ?? 0;

    if (total === 0) {
      return NextResponse.json({ data: [], total: 0, page, pageSize, totalPages: 0 });
    }

    const sortCol = sortBy === "name" ? inquiries.name : inquiries.createdAt;
    const orderFn = sortOrder === "asc" ? asc : desc;

    const data = await db
      .select()
      .from(inquiries)
      .where(where)
      .orderBy(orderFn(sortCol))
      .limit(pageSize)
      .offset(offset);

    return NextResponse.json({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("GET inquiries error:", error);
    return NextResponse.json({ error: "문의 목록을 불러오지 못했습니다" }, { status: 500 });
  }
}

// Bulk actions (mark as read, delete)
export async function PATCH(request: NextRequest) {
  const user = await getApiUser(request);
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { action, ids } = body as { action: string; ids: string[] };

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return badRequestResponse("대상 항목을 선택해주세요");
    }

    if (action === "markAsRead") {
      await db
        .update(inquiries)
        .set({ isRead: true })
        .where(inArray(inquiries.id, ids));

      await logActivity({
        userId: user.userId,
        userName: user.name,
        action: "update",
        resource: "inquiry",
        details: JSON.stringify({ action: "markAsRead", count: ids.length }),
      });
    }

    revalidatePath("/admin/inquiries");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH inquiries error:", error);
    return NextResponse.json({ error: "일괄 처리에 실패했습니다" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getApiUser(request);
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json();
    const ids: string[] = body.ids;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return badRequestResponse("삭제할 항목을 선택해주세요");
    }

    await db.delete(inquiries).where(inArray(inquiries.id, ids));

    await logActivity({
      userId: user.userId,
      userName: user.name,
      action: "delete",
      resource: "inquiry",
      details: JSON.stringify({ ids, count: ids.length }),
    });

    revalidatePath("/admin/inquiries");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE inquiries error:", error);
    return NextResponse.json({ error: "문의 삭제에 실패했습니다" }, { status: 500 });
  }
}
