import Link from "next/link";
import { db } from "@/lib/db";
import { portfolios, samples, inquiries, pageViews, siteVisits } from "@/lib/db/schema";
import { eq, sql, desc, gte } from "drizzle-orm";
import { formatDate, formatPhone } from "@/lib/utils";
import { INQUIRY_TYPES } from "@/lib/constants";

export default async function AdminDashboardPage() {
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
    db.select({ count: sql<number>`count(*)` }).from(siteVisits).catch(() => [{ count: 0 }]),
    db.select({ count: sql<number>`count(*)` }).from(siteVisits).where(gte(siteVisits.visitedAt, todayStr)).catch(() => [{ count: 0 }]),
    db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(5),
    db
      .select({ page: pageViews.page, views: sql<number>`count(*)` })
      .from(pageViews)
      .where(sql`${pageViews.page} LIKE '/portfolio/%'`)
      .groupBy(pageViews.page)
      .orderBy(sql`count(*) DESC`)
      .limit(5),
  ]);

  // Resolve portfolio titles
  const popIds = popularPortfolios.map((p) => p.page.replace("/portfolio/", ""));
  const allPortfolios = popIds.length > 0
    ? await db.select({ id: portfolios.id, title: portfolios.title }).from(portfolios)
    : [];
  const titleMap = new Map(allPortfolios.map((p) => [p.id, p.title]));
  const popularWithTitles = popularPortfolios.map((p) => ({
    id: p.page.replace("/portfolio/", ""),
    title: titleMap.get(p.page.replace("/portfolio/", "")) ?? "알 수 없음",
    views: p.views,
  }));

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6 sm:text-2xl sm:mb-8">대시보드</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 mb-6 sm:mb-8">
        <Link
          href="/admin/portfolio"
          className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-md transition-shadow group"
        >
          <p className="text-sm font-medium text-gray-500">전체 시공사례</p>
          <p className="text-2xl font-bold text-gray-900 mt-1 sm:mt-2 sm:text-3xl group-hover:text-amber-600 transition-colors">
            {portfolioCount?.count ?? 0}
          </p>
        </Link>
        <Link
          href="/admin/samples"
          className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-md transition-shadow group"
        >
          <p className="text-sm font-medium text-gray-500">전체 샘플</p>
          <p className="text-2xl font-bold text-gray-900 mt-1 sm:mt-2 sm:text-3xl group-hover:text-amber-600 transition-colors">
            {sampleCount?.count ?? 0}
          </p>
        </Link>
        <Link
          href="/admin/inquiries"
          className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-md transition-shadow group"
        >
          <p className="text-sm font-medium text-gray-500">전체 문의</p>
          <p className="text-2xl font-bold text-gray-900 mt-1 sm:mt-2 sm:text-3xl group-hover:text-amber-600 transition-colors">
            {inquiryCount?.count ?? 0}
          </p>
        </Link>
        <Link
          href="/admin/inquiries?isRead=false"
          className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-md transition-shadow group"
        >
          <p className="text-sm font-medium text-gray-500">읽지 않은 문의</p>
          <p className="text-2xl font-bold text-red-600 mt-1 sm:mt-2 sm:text-3xl">{unreadCount?.count ?? 0}</p>
        </Link>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <p className="text-sm font-medium text-gray-500">오늘 방문</p>
          <p className="text-2xl font-bold text-blue-600 mt-1 sm:mt-2 sm:text-3xl">{todayViews?.count ?? 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <p className="text-sm font-medium text-gray-500">총 방문</p>
          <p className="text-2xl font-bold text-gray-900 mt-1 sm:mt-2 sm:text-3xl">{(totalViews?.count ?? 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Popular Portfolios */}
      {popularWithTitles.length > 0 && (
        <div className="bg-white rounded-lg shadow mb-6 sm:mb-8">
          <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">인기 시공사례</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {popularWithTitles.map((p, i) => (
              <Link
                key={p.id}
                href={`/admin/portfolio/${p.id}/edit`}
                prefetch={false}
                className="flex items-center justify-between px-4 py-3 sm:px-6 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{p.title}</span>
                </div>
                <span className="text-sm text-gray-500">{p.views.toLocaleString()} views</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Inquiries */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">최근 문의</h2>
          <Link
            href="/admin/inquiries"
            className="text-sm text-amber-600 hover:text-amber-700 font-medium transition"
          >
            전체 보기
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2.5 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  이름
                </th>
                <th className="px-3 py-2.5 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  연락처
                </th>
                <th className="px-3 py-2.5 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  유형
                </th>
                <th className="px-3 py-2.5 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  상태
                </th>
                <th className="px-3 py-2.5 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  날짜
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentInquiries.map((inquiry) => {
                const type = INQUIRY_TYPES.find(
                  (t) => t.value === inquiry.inquiryType
                );
                return (
                  <tr key={inquiry.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 sm:px-6 sm:py-4 text-sm text-gray-900">
                      <Link
                        href={`/admin/inquiries/${inquiry.id}`}
                        className="hover:text-amber-600 font-medium transition"
                      >
                        {inquiry.name}
                      </Link>
                    </td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 text-sm text-gray-500">
                      {formatPhone(inquiry.phone)}
                    </td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 text-sm text-gray-500">
                      {type?.label ?? inquiry.inquiryType}
                    </td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          inquiry.isRead
                            ? "bg-gray-100 text-gray-600"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {inquiry.isRead ? "읽음" : "새 문의"}
                      </span>
                    </td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 text-sm text-gray-500">
                      {formatDate(inquiry.createdAt)}
                    </td>
                  </tr>
                );
              })}
              {recentInquiries.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    문의가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Link
          href="/admin/portfolio/new"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group"
        >
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
            + 새 시공사례 추가
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            새로운 시공사례를 등록합니다.
          </p>
        </Link>
        <Link
          href="/admin/samples/new"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group"
        >
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
            + 새 샘플 추가
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            새로운 샘플을 등록합니다.
          </p>
        </Link>
      </div>
    </div>
  );
}
