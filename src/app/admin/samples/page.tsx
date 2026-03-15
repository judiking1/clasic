import Link from "next/link";
import Image from "next/image";
import { getSamples } from "@/actions/samples";
import { deleteSample } from "@/actions/samples";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminSamplesPage() {
  const samples = await getSamples();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">샘플 관리</h1>
        <Link
          href="/admin/samples/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          새 샘플 추가
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
                  이름
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  브랜드
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  색상
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  패턴
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {samples.map((sample) => (
                <tr key={sample.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 relative rounded overflow-hidden bg-gray-100">
                      {sample.imageUrl ? (
                        <Image
                          src={sample.imageUrl}
                          alt={sample.name}
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
                    {sample.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {sample.brand}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {sample.colorCategory}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {sample.patternType}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/admin/samples/${sample.id}/edit`}
                      className="inline-flex px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                    >
                      수정
                    </Link>
                    <DeleteButton
                      action={async () => {
                        "use server";
                        return deleteSample(sample.id);
                      }}
                    />
                  </td>
                </tr>
              ))}
              {samples.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    등록된 샘플이 없습니다.
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
