"use server";

import { revalidatePath, unstable_cache } from "next/cache";
import { updateTag } from "next/cache";
import { db } from "@/lib/db";
import { samples } from "@/lib/db/schema";
import { eq, desc, asc, like, or, and, sql, inArray } from "drizzle-orm";
import { generateId, getPaginationValues } from "@/lib/utils";
import { sampleSchema } from "@/lib/validations/sample";
import { deleteImage } from "./upload";
import type { ActionResult, Sample, PaginatedResult } from "@/types";

export async function createSample(formData: FormData): Promise<ActionResult> {
  const raw = {
    name: formData.get("name") as string,
    brand: (formData.get("brand") as string) || "",
    colorCategory: (formData.get("colorCategory") as string) || "white",
    patternType: (formData.get("patternType") as string) || "solid",
    description: (formData.get("description") as string) || "",
  };

  const parsed = sampleSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const imageUrl = (formData.get("imageUrl") as string) || "";

  try {
    const id = generateId();
    await db.insert(samples).values({
      id,
      ...parsed.data,
      imageUrl,
      createdAt: new Date().toISOString(),
    });

    updateTag("samples");
    revalidatePath("/samples");
    return { success: true, data: id };
  } catch (error) {
    console.error("Create sample error:", error);
    return { success: false, error: "샘플 생성에 실패했습니다" };
  }
}

export async function updateSample(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    name: formData.get("name") as string,
    brand: (formData.get("brand") as string) || "",
    colorCategory: (formData.get("colorCategory") as string) || "white",
    patternType: (formData.get("patternType") as string) || "solid",
    description: (formData.get("description") as string) || "",
  };

  const parsed = sampleSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const imageUrl = (formData.get("imageUrl") as string) || "";

  try {
    const old = await db
      .select()
      .from(samples)
      .where(eq(samples.id, id))
      .limit(1);
    if (old[0]?.imageUrl && old[0].imageUrl !== imageUrl) {
      await deleteImage(old[0].imageUrl);
    }

    await db
      .update(samples)
      .set({ ...parsed.data, imageUrl })
      .where(eq(samples.id, id));

    updateTag("samples");
    revalidatePath("/samples");
    return { success: true };
  } catch (error) {
    console.error("Update sample error:", error);
    return { success: false, error: "샘플 수정에 실패했습니다" };
  }
}

export async function deleteSample(id: string): Promise<ActionResult> {
  try {
    const sample = await db
      .select()
      .from(samples)
      .where(eq(samples.id, id))
      .limit(1);
    if (sample[0]?.imageUrl) {
      await deleteImage(sample[0].imageUrl);
    }

    await db.delete(samples).where(eq(samples.id, id));
    updateTag("samples");
    revalidatePath("/samples");
    return { success: true };
  } catch (error) {
    console.error("Delete sample error:", error);
    return { success: false, error: "샘플 삭제에 실패했습니다" };
  }
}

async function _getSamples(filters?: {
  brand?: string;
  colorCategory?: string;
}): Promise<Sample[]> {
  try {
    if (filters?.colorCategory && filters.colorCategory !== "all") {
      return await db
        .select()
        .from(samples)
        .where(eq(samples.colorCategory, filters.colorCategory))
        .orderBy(desc(samples.createdAt));
    }

    return await db.select().from(samples).orderBy(desc(samples.createdAt));
  } catch {
    return [];
  }
}

export const getSamples = unstable_cache(
  _getSamples,
  ["samples-list"],
  { revalidate: false, tags: ["samples"] }
);

export async function getSamplesPaginated(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  colorCategory?: string;
  patternType?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<PaginatedResult<Sample>> {
  const { page, pageSize, offset } = getPaginationValues(params.page, params.pageSize);
  const empty = { data: [], total: 0, page, pageSize, totalPages: 0 };

  try {
    const conditions = [];
    if (params.colorCategory && params.colorCategory !== "all") {
      conditions.push(eq(samples.colorCategory, params.colorCategory));
    }
    if (params.patternType && params.patternType !== "all") {
      conditions.push(eq(samples.patternType, params.patternType));
    }
    if (params.search) {
      const s = `%${params.search}%`;
      conditions.push(or(like(samples.name, s), like(samples.brand, s))!);
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(samples)
      .where(where);
    const total = countResult?.count ?? 0;
    if (total === 0) return empty;

    const sortCol = params.sortBy === "name" ? samples.name : samples.createdAt;
    const orderFn = params.sortOrder === "asc" ? asc : desc;

    const data = await db
      .select()
      .from(samples)
      .where(where)
      .orderBy(orderFn(sortCol))
      .limit(pageSize)
      .offset(offset);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  } catch (error) {
    console.error("getSamplesPaginated error:", error);
    return empty;
  }
}

export async function deleteSamples(ids: string[]): Promise<ActionResult> {
  try {
    for (const id of ids) {
      await deleteSample(id);
    }
    return { success: true };
  } catch (error) {
    console.error("Bulk delete samples error:", error);
    return { success: false, error: "일괄 삭제에 실패했습니다" };
  }
}

export async function getSampleCount(): Promise<number> {
  try {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(samples);
    return result?.count ?? 0;
  } catch {
    return 0;
  }
}

export async function getSample(id: string): Promise<Sample | null> {
  try {
    const result = await db
      .select()
      .from(samples)
      .where(eq(samples.id, id))
      .limit(1);
    return result[0] || null;
  } catch {
    return null;
  }
}
