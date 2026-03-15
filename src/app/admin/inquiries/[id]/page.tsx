import Link from "next/link";
import { notFound } from "next/navigation";
import { getInquiry, markInquiryAsRead, deleteInquiry } from "@/actions/inquiries";
import { formatDate, formatPhone } from "@/lib/utils";
import DeleteButton from "@/components/admin/DeleteButton";

interface InquiryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function InquiryDetailPage({
  params,
}: InquiryDetailPageProps) {
  const { id } = await params;
  const inquiry = await getInquiry(id);

  if (!inquiry) {
    notFound();
  }

  await markInquiryAsRead(id);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">문의 상세</h1>
        <div className="flex items-center gap-3">
          <DeleteButton
            action={async () => {
              "use server";
              return deleteInquiry(id);
            }}
          />
          <Link
            href="/admin/inquiries"
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            목록으로
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                이름
              </label>
              <p className="text-gray-900">{inquiry.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                연락처
              </label>
              <p className="text-gray-900">{formatPhone(inquiry.phone)}</p>
            </div>
            {inquiry.email && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  이메일
                </label>
                <p className="text-gray-900">{inquiry.email}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                문의 유형
              </label>
              <p className="text-gray-900">{inquiry.inquiryType}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                접수일
              </label>
              <p className="text-gray-900">{formatDate(inquiry.createdAt)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                상태
              </label>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  inquiry.isRead
                    ? "bg-gray-100 text-gray-600"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {inquiry.isRead ? "읽음" : "새 문의"}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-medium text-gray-500 mb-2">
              문의 내용
            </label>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900 whitespace-pre-wrap">
                {inquiry.message}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
