import { db } from "@/lib/db";
import { portfolios } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") || "all";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize")) || 12));
  const offset = (page - 1) * pageSize;

  try {
    const where = category && category !== "all"
      ? eq(portfolios.category, category)
      : undefined;

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(portfolios)
      .where(where);
    const total = countResult?.count ?? 0;

    if (total === 0) {
      return NextResponse.json(
        { data: [], total: 0, page, pageSize, totalPages: 0 },
        { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
      );
    }

    const rows = await db
      .select({
        id: portfolios.id,
        title: portfolios.title,
        category: portfolios.category,
        description: portfolios.description,
        thumbnailUrl: portfolios.thumbnailUrl,
        isFeatured: portfolios.isFeatured,
        createdAt: portfolios.createdAt,
      })
      .from(portfolios)
      .where(where)
      .orderBy(desc(portfolios.createdAt))
      .limit(pageSize)
      .offset(offset);

    return NextResponse.json(
      {
        data: rows,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
      { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch (error) {
    console.error("GET /api/portfolios error:", error);
    return NextResponse.json(
      { data: [], total: 0, page, pageSize, totalPages: 0 },
      { status: 500 }
    );
  }
}
