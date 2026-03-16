"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPortfolio, updatePortfolio } from "@/actions/portfolio";
import { PORTFOLIO_CATEGORIES } from "@/lib/constants";
import ImageUploader from "@/components/ui/ImageUploader";
import type { PortfolioWithImages } from "@/types";

interface PortfolioFormProps {
  mode: "create" | "edit";
  initialData?: PortfolioWithImages;
}

export default function PortfolioForm({ mode, initialData }: PortfolioFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialData?.images?.map((img) => img.imageUrl) ?? []
  );
  const [imageAlts, setImageAlts] = useState<string[]>(
    initialData?.images?.map((img) => img.altText ?? "") ?? []
  );

  const categories = PORTFOLIO_CATEGORIES.filter((cat) => cat.value !== "all");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("isFeatured", String(isFeatured));

      if (imageUrls.length > 0) {
        formData.append("thumbnailUrl", imageUrls[0]);
      }
      imageUrls.forEach((url, index) => {
        formData.append("imageUrls", url);
        formData.append("imageAlts", imageAlts[index] ?? "");
      });

      let result;
      if (mode === "edit" && initialData) {
        result = await updatePortfolio(initialData.id, formData);
      } else {
        result = await createPortfolio(formData);
      }

      if (result.success) {
        router.push("/admin/portfolio");
        router.refresh();
      } else {
        setError(result.error ?? "오류가 발생했습니다.");
      }
    } catch {
      setError("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageAltChange = (index: number, alt: string) => {
    setImageAlts((prev) => {
      const next = [...prev];
      next[index] = alt;
      return next;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="시공사례 제목을 입력하세요"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            카테고리
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">카테고리를 선택하세요</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            설명
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            placeholder="시공사례에 대한 설명을 입력하세요"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            id="isFeatured"
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
            추천 시공사례로 표시
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">이미지</h2>
        <ImageUploader
          images={imageUrls}
          onChange={(urls) => {
            setImageUrls(urls);
            setImageAlts((prev) => {
              const next = [...prev];
              while (next.length < urls.length) next.push("");
              return next.slice(0, urls.length);
            });
          }}
          multiple
        />

        {imageUrls.length > 0 && (
          <div className="mt-4 space-y-3">
            {imageUrls.map((url, index) => (
              <div key={url} className="flex items-center gap-3">
                <span className="text-sm text-gray-500 w-20 shrink-0">
                  이미지 {index + 1}
                </span>
                <input
                  type="text"
                  value={imageAlts[index] ?? ""}
                  onChange={(e) => handleImageAltChange(index, e.target.value)}
                  placeholder="이미지 설명 (alt)"
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition"
        >
          {isSubmitting
            ? "저장 중..."
            : mode === "create"
              ? "시공사례 등록"
              : "시공사례 수정"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/portfolio")}
          className="px-6 py-2.5 text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 font-medium rounded-lg transition"
        >
          취소
        </button>
      </div>
    </form>
  );
}
