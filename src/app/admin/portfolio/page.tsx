import { getPortfoliosPaginated } from "@/actions/portfolio";
import { PortfolioTable } from "@/components/admin/PortfolioTable";
import Link from "next/link";

export default async function AdminPortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const result = await getPortfoliosPaginated({
    page: params.page ? Number(params.page) : 1,
    pageSize: params.pageSize ? Number(params.pageSize) : 20,
    search: params.search,
    category: params.category,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder as "asc" | "desc" | undefined,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">시공사례 관리</h1>
        <Link
          href="/admin/portfolio/new"
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          새 시공사례 추가
        </Link>
      </div>
      <PortfolioTable result={result} />
    </div>
  );
}
