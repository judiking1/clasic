import { db } from "@/lib/db";
import { portfolios, portfolioImages, pageViews } from "@/lib/db/schema";
import { eq, desc, sql, inArray } from "drizzle-orm";
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

    // Batch fetch image counts + view counts for all portfolios on this page
    const ids = rows.map((r) => r.id);

    const imageCounts = ids.length > 0
      ? await db
          .select({
            portfolioId: portfolioImages.portfolioId,
            count: sql<number>`count(*)`,
          })
          .from(portfolioImages)
          .where(inArray(portfolioImages.portfolioId, ids))
          .groupBy(portfolioImages.portfolioId)
      : [];

    // View counts — graceful fallback if page_views table doesn't exist yet
    let viewCounts: { page: string; count: number }[] = [];
    try {
      if (ids.length > 0) {
        viewCounts = await db
          .select({
            page: pageViews.page,
            count: sql<number>`count(*)`,
          })
          .from(pageViews)
          .where(
            inArray(
              pageViews.page,
              ids.map((id) => `/portfolio/${id}`)
            )
          )
          .groupBy(pageViews.page);
      }
    } catch {
      // page_views table may not exist yet — return 0 views
    }

    const imageCountMap = new Map(imageCounts.map((r) => [r.portfolioId, r.count]));
    const viewCountMap = new Map(
      viewCounts.map((r) => [r.page.replace("/portfolio/", ""), r.count])
    );

    const data = rows.map((r) => ({
      ...r,
      imageCount: imageCountMap.get(r.id) ?? 0,
      viewCount: viewCountMap.get(r.id) ?? 0,
    }));

    return NextResponse.json(
      { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
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
