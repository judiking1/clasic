"use server";

import { put, del } from "@vercel/blob";
import type { ActionResult } from "@/types";

export async function uploadImage(formData: FormData): Promise<ActionResult> {
  const file = formData.get("file") as File;

  if (!file) {
    return { success: false, error: "파일이 없습니다" };
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: "JPG, PNG, WebP 파일만 업로드 가능합니다" };
  }

  if (file.size > 4 * 1024 * 1024) {
    return { success: false, error: "파일 크기는 4MB 이하만 가능합니다" };
  }

  try {
    // In development without Blob token, store as data URL placeholder
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${file.type};base64,${base64}`;
      return { success: true, data: dataUrl };
    }

    const blob = await put(file.name, file, {
      access: "public",
    });

    return { success: true, data: blob.url };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "업로드에 실패했습니다" };
  }
}

export async function deleteImage(url: string): Promise<ActionResult> {
  try {
    if (!url.startsWith("http") || !process.env.BLOB_READ_WRITE_TOKEN) {
      return { success: true };
    }
    await del(url);
    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return { success: false, error: "이미지 삭제에 실패했습니다" };
  }
}
