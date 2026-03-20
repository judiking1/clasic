import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { portfolios, portfolioImages } from "@/lib/db/schema";
import { eq, desc, asc, like, or, and, sql, inArray } from "drizzle-orm";
import { getApiUser, unauthorizedResponse, badRequestResponse } from "@/lib/api-auth";
import { generateId, getPaginationValues } from "@/lib/utils";
import { portfolioSchema } from "@/lib/validations/portfolio";
import { logActivity } from "@/lib/activity-logger";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const user = await getApiUser(request);
  if (!user) return unauthorizedResponse();

  const { searchParams } = request.nextUrl;
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 20;
  const search = searchParams.get("search") || undefined;
  const category = searchParams.get("category") || undefined;
  const sortBy = searchParams.get("sortBy") || undefined;
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  const { offset } = getPaginationValues(page, pageSize);

  try {
    const conditions = [];
    if (category && category !== "all") {
      conditions.push(eq(portfolios.category, category));
    }
    if (search) {
      const s = `%${search}%`;
      conditions.push(
        or(like(portfolios.title, s), like(portfolios.description, s))!
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(portfolios)
      .where(where);
    const total = countResult?.count ?? 0;

    if (total === 0) {
      return NextResponse.json({
        data: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      });
    }

    const sortCol =
      sortBy === "title" ? portfolios.title : portfolios.createdAt;
    const orderFn = sortOrder === "asc" ? asc : desc;

    const rows = await db
      .select()
      .from(portfolios)
      .where(where)
      .orderBy(orderFn(sortCol))
      .limit(pageSize)
      .offset(offset);

    const ids = rows.map((r) => r.id);
    const allImages =
      ids.length > 0
        ? await db
            .select()
            .from(portfolioImages)
            .where(inArray(portfolioImages.portfolioId, ids))
            .orderBy(portfolioImages.sortOrder)
        : [];

    const imageMap = new Map<string, (typeof allImages)[number][]>();
    for (const img of allImages) {
      const arr = imageMap.get(img.portfolioId) ?? [];
      arr.push(img);
      imageMap.set(img.portfolioId, arr);
    }

    const data = rows.map((p) => ({
      ...p,
      images: imageMap.get(p.id) ?? [],
    }));

    return NextResponse.json({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("GET portfolios error:", error);
    return NextResponse.json(
      { error: "포트폴리오 목록을 불러오지 못했습니다" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await getApiUser(request);
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json();
    const parsed = portfolioSchema.safeParse(body);
    if (!parsed.success) {
      return badRequestResponse(parsed.error.issues[0]?.message || "유효하지 않은 데이터");
    }

    const now = new Date().toISOString();
    const id = generateId();

    await db.insert(portfolios).values({
      id,
      ...parsed.data,
      thumbnailUrl: body.thumbnailUrl || "",
      createdAt: now,
      updatedAt: now,
    });

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
      action: "create",
      resource: "portfolio",
      resourceId: id,
      details: JSON.stringify({ title: parsed.data.title }),
    });

    revalidatePath("/portfolio");
    revalidatePath("/");

    return NextResponse.json({ success: true, data: { id } }, { status: 201 });
  } catch (error) {
    console.error("POST portfolio error:", error);
    return NextResponse.json(
      { error: "포트폴리오 생성에 실패했습니다" },
      { status: 500 }
    );
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
      await db
        .delete(portfolioImages)
        .where(eq(portfolioImages.portfolioId, id));
      await db.delete(portfolios).where(eq(portfolios.id, id));
    }

    await logActivity({
      userId: user.userId,
      userName: user.name,
      action: "delete",
      resource: "portfolio",
      details: JSON.stringify({ ids, count: ids.length }),
    });

    revalidatePath("/portfolio");
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE portfolios error:", error);
    return NextResponse.json(
      { error: "포트폴리오 삭제에 실패했습니다" },
      { status: 500 }
    );
  }
}
