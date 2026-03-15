"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { generateId } from "@/lib/utils";
import { inquirySchema } from "@/lib/validations/inquiry";
import type { ActionResult, Inquiry } from "@/types";

export async function submitInquiry(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    email: (formData.get("email") as string) || "",
    inquiryType: formData.get("inquiryType") as string,
    message: formData.get("message") as string,
  };

  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  try {
    await db.insert(inquiries).values({
      id: generateId(),
      ...parsed.data,
      createdAt: new Date().toISOString(),
    });

    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (error) {
    console.error("Submit inquiry error:", error);
    return { success: false, error: "문의 접수에 실패했습니다" };
  }
}

export async function getInquiries(): Promise<Inquiry[]> {
  try {
    return await db
      .select()
      .from(inquiries)
      .orderBy(desc(inquiries.createdAt));
  } catch {
    return [];
  }
}

export async function getInquiry(id: string): Promise<Inquiry | null> {
  try {
    const result = await db
      .select()
      .from(inquiries)
      .where(eq(inquiries.id, id))
      .limit(1);
    return result[0] || null;
  } catch {
    return null;
  }
}

export async function markInquiryAsRead(id: string): Promise<ActionResult> {
  try {
    await db
      .update(inquiries)
      .set({ isRead: true })
      .where(eq(inquiries.id, id));
    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch {
    return { success: false, error: "읽음 처리에 실패했습니다" };
  }
}

export async function deleteInquiry(id: string): Promise<ActionResult> {
  try {
    await db.delete(inquiries).where(eq(inquiries.id, id));
    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch {
    return { success: false, error: "문의 삭제에 실패했습니다" };
  }
}

export async function getUnreadCount(): Promise<number> {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(inquiries)
      .where(eq(inquiries.isRead, false));
    return result[0]?.count || 0;
  } catch {
    return 0;
  }
}
