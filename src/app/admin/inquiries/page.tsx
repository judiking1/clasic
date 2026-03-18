import { getInquiriesPaginated } from "@/actions/inquiries";
import { InquiryTable } from "@/components/admin/InquiryTable";

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  const isReadParam = params.isRead;
  let isRead: boolean | undefined;
  if (isReadParam === "true") isRead = true;
  else if (isReadParam === "false") isRead = false;

  const result = await getInquiriesPaginated({
    page: params.page ? Number(params.page) : 1,
    pageSize: params.pageSize ? Number(params.pageSize) : 20,
    search: params.search,
    isRead,
    inquiryType: params.inquiryType,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder as "asc" | "desc" | undefined,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">문의 관리</h1>
      </div>
      <InquiryTable result={result} />
    </div>
  );
}
