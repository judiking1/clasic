import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { portfolios, samples, inquiries } from "@/lib/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { getApiUser, unauthorizedResponse } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const user = await getApiUser(request);
  if (!user) return unauthorizedResponse();

  try {
    const [portfolioCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(portfolios);

    const [sampleCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(samples);

    const [inquiryCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(inquiries);

    const [unreadCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(inquiries)
      .where(eq(inquiries.isRead, false));

    const recentInquiries = await db
      .select()
      .from(inquiries)
      .orderBy(desc(inquiries.createdAt))
      .limit(5);

    return NextResponse.json({
      portfolioCount: portfolioCount?.count ?? 0,
      sampleCount: sampleCount?.count ?? 0,
      inquiryCount: inquiryCount?.count ?? 0,
      unreadCount: unreadCount?.count ?? 0,
      recentInquiries,
    });
  } catch (error) {
    console.error("GET stats error:", error);
    return NextResponse.json(
      { error: "통계를 불러오지 못했습니다" },
      { status: 500 }
    );
  }
}
