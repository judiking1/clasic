import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { samples } from "@/lib/db/schema";
import { eq, desc, asc, like, or, and, sql } from "drizzle-orm";
import { getApiUser, unauthorizedResponse, badRequestResponse } from "@/lib/api-auth";
import { generateId, getPaginationValues } from "@/lib/utils";
import { sampleSchema } from "@/lib/validations/sample";
import { logActivity } from "@/lib/activity-logger";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const user = await getApiUser(request);
  if (!user) return unauthorizedResponse();

  const { searchParams } = request.nextUrl;
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 20;
  const search = searchParams.get("search") || undefined;
  const colorCategory = searchParams.get("colorCategory") || undefined;
  const patternType = searchParams.get("patternType") || undefined;
  const sortBy = searchParams.get("sortBy") || undefined;
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  const { offset } = getPaginationValues(page, pageSize);

  try {
    const conditions = [];
    if (colorCategory && colorCategory !== "all") {
      conditions.push(eq(samples.colorCategory, colorCategory));
    }
    if (patternType && patternType !== "all") {
      conditions.push(eq(samples.patternType, patternType));
    }
    if (search) {
      const s = `%${search}%`;
      conditions.push(or(like(samples.name, s), like(samples.brand, s))!);
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(samples)
      .where(where);
    const total = countResult?.count ?? 0;

    if (total === 0) {
      return NextResponse.json({ data: [], total: 0, page, pageSize, totalPages: 0 });
    }

    const sortCol = sortBy === "name" ? samples.name : samples.createdAt;
    const orderFn = sortOrder === "asc" ? asc : desc;

    const data = await db
      .select()
      .from(samples)
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
    console.error("GET samples error:", error);
    return NextResponse.json({ error: "샘플 목록을 불러오지 못했습니다" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getApiUser(request);
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json();
    const parsed = sampleSchema.safeParse(body);
    if (!parsed.success) {
      return badRequestResponse(parsed.error.issues[0]?.message || "유효하지 않은 데이터");
    }

    const id = generateId();
    await db.insert(samples).values({
      id,
      ...parsed.data,
      imageUrl: body.imageUrl || "",
      createdAt: new Date().toISOString(),
    });

    await logActivity({
      userId: user.userId,
      userName: user.name,
      action: "create",
      resource: "sample",
      resourceId: id,
      details: JSON.stringify({ name: parsed.data.name }),
    });

    revalidatePath("/samples");

    return NextResponse.json({ success: true, data: { id } }, { status: 201 });
  } catch (error) {
    console.error("POST sample error:", error);
    return NextResponse.json({ error: "샘플 생성에 실패했습니다" }, { status: 500 });
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

    for (const id of ids) {
      await db.delete(samples).where(eq(samples.id, id));
    }

    await logActivity({
      userId: user.userId,
      userName: user.name,
      action: "delete",
      resource: "sample",
      details: JSON.stringify({ ids, count: ids.length }),
    });

    revalidatePath("/samples");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE samples error:", error);
    return NextResponse.json({ error: "샘플 삭제에 실패했습니다" }, { status: 500 });
  }
}
