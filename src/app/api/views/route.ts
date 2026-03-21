import { db } from "@/lib/db";
import { pageViews, siteVisits } from "@/lib/db/schema";
import { sql, gte } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { generateId } from "@/lib/utils";

// POST: Record a page view or site visit
// body: { page: "/portfolio/abc123" } → portfolio view
// body: { type: "visit" }             → site visitor (once per session)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.type === "visit") {
      await db.insert(siteVisits).values({
        id: generateId(),
        visitedAt: new Date().toISOString(),
      });
      return NextResponse.json({ ok: true });
    }

    const { page } = body;
    if (!page || typeof page !== "string") {
      return NextResponse.json({ error: "page is required" }, { status: 400 });
    }

    await db.insert(pageViews).values({
      id: generateId(),
      page,
      viewedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// GET: Get statistics
// ?summary=true    → site visitors today + total
// ?portfolio=id    → views for specific portfolio
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const summary = searchParams.get("summary");
  const portfolioId = searchParams.get("portfolio");

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString();

    if (summary === "true") {
      let totalCount = 0;
      let todayCount = 0;
      try {
        const [totalResult] = await db
          .select({ count: sql<number>`count(*)` })
          .from(siteVisits);
        const [todayResult] = await db
          .select({ count: sql<number>`count(*)` })
          .from(siteVisits)
          .where(gte(siteVisits.visitedAt, todayStr));
        totalCount = totalResult?.count ?? 0;
        todayCount = todayResult?.count ?? 0;
      } catch {
        // table may not exist yet
      }

      return NextResponse.json(
        { total: totalCount, today: todayCount },
        { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" } }
      );
    }

    if (portfolioId) {
      const pagePath = `/portfolio/${portfolioId}`;
      let views = 0;
      try {
        const [result] = await db
          .select({ count: sql<number>`count(*)` })
          .from(pageViews)
          .where(sql`${pageViews.page} = ${pagePath}`);
        views = result?.count ?? 0;
      } catch {
        // table may not exist yet
      }

      return NextResponse.json(
        { views },
        { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" } }
      );
    }

    return NextResponse.json({ error: "Provide portfolio or summary param" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
