import { getSamplesPaginated } from "@/actions/samples";
import { SampleTable } from "@/components/admin/SampleTable";
import Link from "next/link";

export default async function AdminSamplesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const result = await getSamplesPaginated({
    page: params.page ? Number(params.page) : 1,
    pageSize: params.pageSize ? Number(params.pageSize) : 20,
    search: params.search,
    colorCategory: params.colorCategory,
    patternType: params.patternType,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder as "asc" | "desc" | undefined,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">샘플 관리</h1>
        <Link
          href="/admin/samples/new"
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          새 샘플 추가
        </Link>
      </div>
      <SampleTable result={result} />
    </div>
  );
}
