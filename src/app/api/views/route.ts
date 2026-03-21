import { db } from "@/lib/db";
import { pageViews } from "@/lib/db/schema";
import { sql, like, and, gte } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { generateId } from "@/lib/utils";

// POST: Record a page view
export async function POST(request: NextRequest) {
  try {
    const { page } = await request.json();
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

// GET: Get view statistics
// ?page=/portfolio/abc123  → views for specific page
// ?summary=true            → today + total for entire site
// ?portfolio=abc123        → views for specific portfolio
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = searchParams.get("page");
  const summary = searchParams.get("summary");
  const portfolioId = searchParams.get("portfolio");

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString();

    if (summary === "true") {
      const [totalResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(pageViews);
      const [todayResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(pageViews)
        .where(gte(pageViews.viewedAt, todayStr));

      return NextResponse.json({
        total: totalResult?.count ?? 0,
        today: todayResult?.count ?? 0,
      }, {
        headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" },
      });
    }

    if (portfolioId) {
      const pagePath = `/portfolio/${portfolioId}`;
      const [result] = await db
        .select({ count: sql<number>`count(*)` })
        .from(pageViews)
        .where(sql`${pageViews.page} = ${pagePath}`);

      return NextResponse.json({
        views: result?.count ?? 0,
      }, {
        headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" },
      });
    }

    if (page) {
      const [result] = await db
        .select({ count: sql<number>`count(*)` })
        .from(pageViews)
        .where(sql`${pageViews.page} = ${page}`);

      return NextResponse.json({
        views: result?.count ?? 0,
      }, {
        headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" },
      });
    }

    return NextResponse.json({ error: "Provide page, portfolio, or summary param" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
