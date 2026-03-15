"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { uploadImage } from "@/actions/upload";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  images: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
}

export default function ImageUploader({
  images,
  onChange,
  multiple = false,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (fileArray.length === 0) return;

      setIsUploading(true);
      setUploadError("");

      const filesToUpload = multiple ? fileArray : [fileArray[0]];
      const newUrls: string[] = [];

      try {
        for (const file of filesToUpload) {
          const formData = new FormData();
          formData.append("file", file);
          const result = await uploadImage(formData);
          if (result.success && result.data) {
            newUrls.push(result.data as string);
          } else {
            setUploadError(result.error ?? "이미지 업로드에 실패했습니다.");
          }
        }

        if (newUrls.length > 0) {
          if (multiple) {
            onChange([...images, ...newUrls]);
          } else {
            onChange(newUrls);
          }
        }
      } catch {
        setUploadError("이미지 업로드 중 오류가 발생했습니다.");
      } finally {
        setIsUploading(false);
      }
    },
    [images, multiple, onChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [handleFiles]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const newImages = images.filter((_, i) => i !== index);
      onChange(newImages);
    },
    [images, onChange]
  );

  return (
    <div className="space-y-4">
      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((url, index) => (
            <div key={url} className="relative group">
              <div className="w-24 h-24 relative rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={url}
                  alt={`업로드 이미지 ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition",
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100"
        )}
      >
        {isUploading ? (
          <div className="text-blue-600">
            <p className="text-sm font-medium">업로드 중...</p>
          </div>
        ) : (
          <div className="text-gray-500">
            <svg
              className="w-8 h-8 mx-auto mb-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm font-medium">
              이미지를 드래그하거나 클릭하여 업로드
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {multiple ? "여러 이미지를 선택할 수 있습니다" : "하나의 이미지를 선택하세요"}
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {uploadError && (
        <p className="text-sm text-red-600">{uploadError}</p>
      )}
    </div>
  );
}
