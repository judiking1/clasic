"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createSample, updateSample } from "@/actions/samples";
import { uploadImage } from "@/actions/upload";
import { SAMPLE_COLORS, SAMPLE_PATTERNS } from "@/lib/constants";
import type { Sample } from "@/types";

interface SampleFormProps {
  mode: "create" | "edit";
  initialData?: Sample;
}

export default function SampleForm({ mode, initialData }: SampleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(initialData?.name ?? "");
  const [brand, setBrand] = useState(initialData?.brand ?? "");
  const [colorCategory, setColorCategory] = useState(initialData?.colorCategory ?? "");
  const [patternType, setPatternType] = useState(initialData?.patternType ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadImage(formData);
      if (result.success && result.data) {
        setImageUrl(result.data as string);
      } else {
        setError(result.error ?? "이미지 업로드에 실패했습니다.");
      }
    } catch {
      setError("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("brand", brand);
      formData.append("colorCategory", colorCategory);
      formData.append("patternType", patternType);
      formData.append("description", description);
      formData.append("imageUrl", imageUrl);

      let result;
      if (mode === "edit" && initialData) {
        result = await updateSample(initialData.id, formData);
      } else {
        result = await createSample(formData);
      }

      if (result.success) {
        router.push("/admin/samples");
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
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            이름
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="샘플 이름을 입력하세요"
          />
        </div>

        <div>
          <label
            htmlFor="brand"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            브랜드
          </label>
          <input
            id="brand"
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="브랜드명을 입력하세요"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="colorCategory"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              색상 카테고리
            </label>
            <select
              id="colorCategory"
              value={colorCategory}
              onChange={(e) => setColorCategory(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">색상을 선택하세요</option>
              {SAMPLE_COLORS.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="patternType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              패턴 유형
            </label>
            <select
              id="patternType"
              value={patternType}
              onChange={(e) => setPatternType(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">패턴을 선택하세요</option>
              {SAMPLE_PATTERNS.map((pattern) => (
                <option key={pattern.value} value={pattern.value}>
                  {pattern.label}
                </option>
              ))}
            </select>
          </div>
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
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            placeholder="샘플에 대한 설명을 입력하세요"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">이미지</h2>

        {imageUrl && (
          <div className="mb-4 relative inline-block">
            <div className="w-40 h-40 relative rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={imageUrl}
                alt={name || "샘플 이미지"}
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm transition"
            >
              &times;
            </button>
          </div>
        )}

        <div>
          <label
            htmlFor="imageFile"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {imageUrl ? "이미지 변경" : "이미지 업로드"}
          </label>
          <input
            id="imageFile"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
          />
          {isUploading && (
            <p className="text-sm text-blue-600 mt-2">업로드 중...</p>
          )}
        </div>
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
              ? "샘플 등록"
              : "샘플 수정"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/samples")}
          className="px-6 py-2.5 text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 font-medium rounded-lg transition"
        >
          취소
        </button>
      </div>
    </form>
  );
}
