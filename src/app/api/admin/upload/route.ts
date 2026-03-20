import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { getApiUser, unauthorizedResponse, badRequestResponse } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  const user = await getApiUser(request);
  if (!user) return unauthorizedResponse();

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return badRequestResponse("파일이 없습니다");
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return badRequestResponse("JPG, PNG, WebP 파일만 업로드 가능합니다");
    }

    if (file.size > 4 * 1024 * 1024) {
      return badRequestResponse("파일 크기는 4MB 이하만 가능합니다");
    }

    // In development without Blob token, store as data URL
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${file.type};base64,${base64}`;
      return NextResponse.json({ success: true, url: dataUrl });
    }

    const blob = await put(file.name, file, { access: "public" });

    return NextResponse.json({ success: true, url: blob.url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "업로드에 실패했습니다" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getApiUser(request);
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { url } = body;

    if (!url || !url.startsWith("http") || !process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ success: true });
    }

    await del(url);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete image error:", error);
    return NextResponse.json({ error: "이미지 삭제에 실패했습니다" }, { status: 500 });
  }
}
