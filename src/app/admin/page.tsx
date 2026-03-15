import Link from "next/link";
import { getPortfolios } from "@/actions/portfolio";
import { getSamples } from "@/actions/samples";
import { getInquiries, getUnreadCount } from "@/actions/inquiries";

export default async function AdminDashboardPage() {
  const [portfolios, samples, inquiries, unreadCount] = await Promise.all([
    getPortfolios(),
    getSamples(),
    getInquiries(),
    getUnreadCount(),
  ]);

  const recentInquiries = inquiries.slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">대시보드</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">전체 시공사례</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {portfolios.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">전체 샘플</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {samples.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">전체 문의</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {inquiries.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">읽지 않은 문의</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{unreadCount}</p>
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">최근 문의</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  이름
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  연락처
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  유형
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  날짜
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <Link
                      href={`/admin/inquiries/${inquiry.id}`}
                      className="hover:text-blue-600"
                    >
                      {inquiry.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {inquiry.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {inquiry.inquiryType}
                  </td>
                  <td className="px-6 py-4 text-sm">
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
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(inquiry.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/portfolio/new"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group"
        >
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
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
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
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
