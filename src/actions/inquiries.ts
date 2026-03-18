"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema";
import { eq, desc, asc, like, or, sql, inArray, and } from "drizzle-orm";
import { generateId, getPaginationValues } from "@/lib/utils";
import { inquirySchema } from "@/lib/validations/inquiry";
import type { ActionResult, Inquiry, PaginatedResult } from "@/types";

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

export async function getInquiriesPaginated(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  isRead?: boolean;
  inquiryType?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<PaginatedResult<Inquiry>> {
  const { page, pageSize, offset } = getPaginationValues(params.page, params.pageSize);
  const empty = { data: [], total: 0, page, pageSize, totalPages: 0 };

  try {
    const conditions = [];
    if (params.isRead !== undefined) {
      conditions.push(eq(inquiries.isRead, params.isRead));
    }
    if (params.inquiryType && params.inquiryType !== "all") {
      conditions.push(eq(inquiries.inquiryType, params.inquiryType));
    }
    if (params.search) {
      const s = `%${params.search}%`;
      conditions.push(or(like(inquiries.name, s), like(inquiries.phone, s), like(inquiries.message, s))!);
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(inquiries)
      .where(where);
    const total = countResult?.count ?? 0;
    if (total === 0) return empty;

    const sortCol = params.sortBy === "name" ? inquiries.name : inquiries.createdAt;
    const orderFn = params.sortOrder === "asc" ? asc : desc;

    const data = await db
      .select()
      .from(inquiries)
      .where(where)
      .orderBy(orderFn(sortCol))
      .limit(pageSize)
      .offset(offset);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  } catch (error) {
    console.error("getInquiriesPaginated error:", error);
    return empty;
  }
}

export async function deleteInquiries(ids: string[]): Promise<ActionResult> {
  try {
    if (ids.length > 0) {
      await db.delete(inquiries).where(inArray(inquiries.id, ids));
      revalidatePath("/admin/inquiries");
    }
    return { success: true };
  } catch (error) {
    console.error("Bulk delete inquiries error:", error);
    return { success: false, error: "일괄 삭제에 실패했습니다" };
  }
}

export async function markInquiriesAsRead(ids: string[]): Promise<ActionResult> {
  try {
    if (ids.length > 0) {
      await db.update(inquiries).set({ isRead: true }).where(inArray(inquiries.id, ids));
      revalidatePath("/admin/inquiries");
    }
    return { success: true };
  } catch {
    return { success: false, error: "일괄 읽음 처리에 실패했습니다" };
  }
}

export async function getInquiryCount(): Promise<number> {
  try {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(inquiries);
    return result?.count ?? 0;
  } catch {
    return 0;
  }
}

export async function getRecentInquiries(limit: number = 5): Promise<Inquiry[]> {
  try {
    return await db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(limit);
  } catch {
    return [];
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
