import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { portfolios, samples, inquiries, pageViews, portfolioImages } from "@/lib/db/schema";
import { eq, sql, desc, gte } from "drizzle-orm";
import { getApiUser, unauthorizedResponse } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const user = await getApiUser(request);
  if (!user) return unauthorizedResponse();

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString();

    const [
      [portfolioCount],
      [sampleCount],
      [inquiryCount],
      [unreadCount],
      [totalViews],
      [todayViews],
      recentInquiries,
      popularPortfolios,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(portfolios),
      db.select({ count: sql<number>`count(*)` }).from(samples),
      db.select({ count: sql<number>`count(*)` }).from(inquiries),
      db.select({ count: sql<number>`count(*)` }).from(inquiries).where(eq(inquiries.isRead, false)),
      db.select({ count: sql<number>`count(*)` }).from(pageViews),
      db.select({ count: sql<number>`count(*)` }).from(pageViews).where(gte(pageViews.viewedAt, todayStr)),
      db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(5),
      db
        .select({
          page: pageViews.page,
          views: sql<number>`count(*)`,
        })
        .from(pageViews)
        .where(sql`${pageViews.page} LIKE '/portfolio/%'`)
        .groupBy(pageViews.page)
        .orderBy(sql`count(*) DESC`)
        .limit(5),
    ]);

    // Resolve portfolio titles for popular portfolios
    const popularIds = popularPortfolios.map((p) =>
      p.page.replace("/portfolio/", "")
    );
    const portfolioTitles = popularIds.length > 0
      ? await db
          .select({ id: portfolios.id, title: portfolios.title })
          .from(portfolios)
      : [];
    const titleMap = new Map(portfolioTitles.map((p) => [p.id, p.title]));

    const popularWithTitles = popularPortfolios.map((p) => {
      const id = p.page.replace("/portfolio/", "");
      return {
        id,
        title: titleMap.get(id) ?? "알 수 없음",
        views: p.views,
      };
    });

    return NextResponse.json({
      portfolioCount: portfolioCount?.count ?? 0,
      sampleCount: sampleCount?.count ?? 0,
      inquiryCount: inquiryCount?.count ?? 0,
      unreadCount: unreadCount?.count ?? 0,
      totalViews: totalViews?.count ?? 0,
      todayViews: todayViews?.count ?? 0,
      recentInquiries,
      popularPortfolios: popularWithTitles,
    });
  } catch (error) {
    console.error("GET stats error:", error);
    return NextResponse.json(
      { error: "통계를 불러오지 못했습니다" },
      { status: 500 }
    );
  }
}
