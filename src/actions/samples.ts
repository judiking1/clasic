"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { samples } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { generateId } from "@/lib/utils";
import { sampleSchema } from "@/lib/validations/sample";
import { deleteImage } from "./upload";
import type { ActionResult, Sample } from "@/types";

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
    revalidatePath("/samples");
    return { success: true };
  } catch (error) {
    console.error("Delete sample error:", error);
    return { success: false, error: "샘플 삭제에 실패했습니다" };
  }
}

export async function getSamples(filters?: {
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
