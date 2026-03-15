import Link from "next/link";
import Image from "next/image";
import { getPortfolios } from "@/actions/portfolio";
import { deletePortfolio } from "@/actions/portfolio";
import { formatDate } from "@/lib/utils";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminPortfolioPage() {
  const portfolios = await getPortfolios();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">시공사례 관리</h1>
        <Link
          href="/admin/portfolio/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          새 시공사례 추가
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  이미지
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  제목
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  카테고리
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  추천
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  날짜
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {portfolios.map((portfolio) => (
                <tr key={portfolio.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="w-16 h-12 relative rounded overflow-hidden bg-gray-100">
                      {portfolio.images && portfolio.images[0] ? (
                        <Image
                          src={portfolio.images[0].imageUrl}
                          alt={portfolio.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No img
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {portfolio.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {portfolio.category}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {portfolio.isFeatured ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                        추천
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-500">
                        일반
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(portfolio.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/admin/portfolio/${portfolio.id}/edit`}
                      className="inline-flex px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                    >
                      수정
                    </Link>
                    <DeleteButton
                      action={async () => {
                        "use server";
                        return deletePortfolio(portfolio.id);
                      }}
                    />
                  </td>
                </tr>
              ))}
              {portfolios.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    등록된 시공사례가 없습니다.
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
