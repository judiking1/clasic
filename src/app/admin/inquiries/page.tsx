import Link from "next/link";
import { getInquiries } from "@/actions/inquiries";
import { formatDate, formatPhone } from "@/lib/utils";

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">문의 관리</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  상태
                </th>
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
                  날짜
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inquiries.map((inquiry) => (
                <tr
                  key={inquiry.id}
                  className={`hover:bg-gray-50 ${
                    !inquiry.isRead ? "bg-blue-50/50" : ""
                  }`}
                >
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
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <Link
                      href={`/admin/inquiries/${inquiry.id}`}
                      className="hover:text-blue-600"
                    >
                      {inquiry.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatPhone(inquiry.phone)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {inquiry.inquiryType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(inquiry.createdAt)}
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    문의가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
