import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { activityLogs } from "@/lib/db/schema";
import { desc, sql, eq, and, like } from "drizzle-orm";
import { getApiUser, unauthorizedResponse } from "@/lib/api-auth";
import { getPaginationValues } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const user = await getApiUser(request);
  if (!user) return unauthorizedResponse();

  const { searchParams } = request.nextUrl;
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 50;
  const resource = searchParams.get("resource") || undefined;
  const action = searchParams.get("action") || undefined;
  const search = searchParams.get("search") || undefined;

  const { offset } = getPaginationValues(page, pageSize);

  try {
    const conditions = [];
    if (resource && resource !== "all") {
      conditions.push(eq(activityLogs.resource, resource));
    }
    if (action && action !== "all") {
      conditions.push(eq(activityLogs.action, action));
    }
    if (search) {
      conditions.push(like(activityLogs.userName, `%${search}%`));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(activityLogs)
      .where(where);
    const total = countResult?.count ?? 0;

    const data = await db
      .select()
      .from(activityLogs)
      .where(where)
      .orderBy(desc(activityLogs.createdAt))
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
    console.error("GET activity logs error:", error);
    return NextResponse.json(
      { error: "활동 로그를 불러오지 못했습니다" },
      { status: 500 }
    );
  }
}
