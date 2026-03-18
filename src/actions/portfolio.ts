"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { portfolios, portfolioImages } from "@/lib/db/schema";
import { eq, desc, asc, like, or, and, sql, inArray } from "drizzle-orm";
import { generateId, getPaginationValues } from "@/lib/utils";
import { portfolioSchema } from "@/lib/validations/portfolio";
import { deleteImage } from "./upload";
import type { ActionResult, PortfolioWithImages, PaginatedResult } from "@/types";

export async function createPortfolio(
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    title: formData.get("title") as string,
    category: formData.get("category") as string,
    description: (formData.get("description") as string) || "",
    isFeatured: formData.get("isFeatured") === "true",
  };

  const parsed = portfolioSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const now = new Date().toISOString();
  const id = generateId();
  const thumbnailUrl = (formData.get("thumbnailUrl") as string) || "";
  const imageUrls = formData.getAll("imageUrls") as string[];
  const imageAlts = formData.getAll("imageAlts") as string[];

  try {
    await db.insert(portfolios).values({
      id,
      ...parsed.data,
      thumbnailUrl,
      createdAt: now,
      updatedAt: now,
    });

    if (imageUrls.length > 0) {
      const imageRecords = imageUrls.map((url, i) => ({
        id: generateId(),
        portfolioId: id,
        imageUrl: url,
        altText: imageAlts[i] || "",
        sortOrder: i,
      }));
      await db.insert(portfolioImages).values(imageRecords);
    }

    revalidatePath("/portfolio");
    revalidatePath("/");
    return { success: true, data: id };
  } catch (error) {
    console.error("Create portfolio error:", error);
    return { success: false, error: "포트폴리오 생성에 실패했습니다" };
  }
}

export async function updatePortfolio(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    title: formData.get("title") as string,
    category: formData.get("category") as string,
    description: (formData.get("description") as string) || "",
    isFeatured: formData.get("isFeatured") === "true",
  };

  const parsed = portfolioSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const thumbnailUrl = (formData.get("thumbnailUrl") as string) || "";
  const imageUrls = formData.getAll("imageUrls") as string[];
  const imageAlts = formData.getAll("imageAlts") as string[];

  try {
    await db
      .update(portfolios)
      .set({
        ...parsed.data,
        thumbnailUrl,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(portfolios.id, id));

    // Delete old images and insert new
    const oldImages = await db
      .select()
      .from(portfolioImages)
      .where(eq(portfolioImages.portfolioId, id));
    for (const img of oldImages) {
      await deleteImage(img.imageUrl);
    }
    await db
      .delete(portfolioImages)
      .where(eq(portfolioImages.portfolioId, id));

    if (imageUrls.length > 0) {
      const imageRecords = imageUrls.map((url, i) => ({
        id: generateId(),
        portfolioId: id,
        imageUrl: url,
        altText: imageAlts[i] || "",
        sortOrder: i,
      }));
      await db.insert(portfolioImages).values(imageRecords);
    }

    revalidatePath("/portfolio");
    revalidatePath(`/portfolio/${id}`);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Update portfolio error:", error);
    return { success: false, error: "포트폴리오 수정에 실패했습니다" };
  }
}

export async function deletePortfolio(id: string): Promise<ActionResult> {
  try {
    const images = await db
      .select()
      .from(portfolioImages)
      .where(eq(portfolioImages.portfolioId, id));
    for (const img of images) {
      await deleteImage(img.imageUrl);
    }
    const portfolio = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.id, id))
      .limit(1);
    if (portfolio[0]?.thumbnailUrl) {
      await deleteImage(portfolio[0].thumbnailUrl);
    }

    await db
      .delete(portfolioImages)
      .where(eq(portfolioImages.portfolioId, id));
    await db.delete(portfolios).where(eq(portfolios.id, id));

    revalidatePath("/portfolio");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete portfolio error:", error);
    return { success: false, error: "포트폴리오 삭제에 실패했습니다" };
  }
}

export async function getPortfolios(
  category?: string
): Promise<PortfolioWithImages[]> {
  try {
    const allPortfolios = category && category !== "all"
      ? await db
          .select()
          .from(portfolios)
          .where(eq(portfolios.category, category))
          .orderBy(desc(portfolios.createdAt))
      : await db
          .select()
          .from(portfolios)
          .orderBy(desc(portfolios.createdAt));

    const result: PortfolioWithImages[] = [];
    for (const p of allPortfolios) {
      const images = await db
        .select()
        .from(portfolioImages)
        .where(eq(portfolioImages.portfolioId, p.id))
        .orderBy(portfolioImages.sortOrder);
      result.push({ ...p, images });
    }
    return result;
  } catch {
    return [];
  }
}

export async function getPortfolio(
  id: string
): Promise<PortfolioWithImages | null> {
  try {
    const result = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.id, id))
      .limit(1);
    if (!result[0]) return null;

    const images = await db
      .select()
      .from(portfolioImages)
      .where(eq(portfolioImages.portfolioId, id))
      .orderBy(portfolioImages.sortOrder);

    return { ...result[0], images };
  } catch {
    return null;
  }
}

export async function getPortfoliosPaginated(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<PaginatedResult<PortfolioWithImages>> {
  const { page, pageSize, offset } = getPaginationValues(params.page, params.pageSize);
  const empty = { data: [], total: 0, page, pageSize, totalPages: 0 };

  try {
    const conditions = [];
    if (params.category && params.category !== "all") {
      conditions.push(eq(portfolios.category, params.category));
    }
    if (params.search) {
      const s = `%${params.search}%`;
      conditions.push(or(like(portfolios.title, s), like(portfolios.description, s))!);
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(portfolios)
      .where(where);
    const total = countResult?.count ?? 0;
    if (total === 0) return empty;

    const sortCol = params.sortBy === "title" ? portfolios.title : portfolios.createdAt;
    const orderFn = params.sortOrder === "asc" ? asc : desc;

    const rows = await db
      .select()
      .from(portfolios)
      .where(where)
      .orderBy(orderFn(sortCol))
      .limit(pageSize)
      .offset(offset);

    const ids = rows.map((r) => r.id);
    const allImages = ids.length > 0
      ? await db.select().from(portfolioImages).where(inArray(portfolioImages.portfolioId, ids)).orderBy(portfolioImages.sortOrder)
      : [];

    const imageMap = new Map<string, typeof allImages>();
    for (const img of allImages) {
      const arr = imageMap.get(img.portfolioId) ?? [];
      arr.push(img);
      imageMap.set(img.portfolioId, arr);
    }

    const data: PortfolioWithImages[] = rows.map((p) => ({
      ...p,
      images: imageMap.get(p.id) ?? [],
    }));

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  } catch (error) {
    console.error("getPortfoliosPaginated error:", error);
    return empty;
  }
}

export async function deletePortfolios(ids: string[]): Promise<ActionResult> {
  try {
    for (const id of ids) {
      await deletePortfolio(id);
    }
    return { success: true };
  } catch (error) {
    console.error("Bulk delete portfolios error:", error);
    return { success: false, error: "일괄 삭제에 실패했습니다" };
  }
}

export async function getPortfolioCount(): Promise<number> {
  try {
    const [result] = await db.select({ count: sql<number>`count(*)` }).from(portfolios);
    return result?.count ?? 0;
  } catch {
    return 0;
  }
}

export async function getFeaturedPortfolios(): Promise<PortfolioWithImages[]> {
  try {
    const featured = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.isFeatured, true))
      .orderBy(desc(portfolios.createdAt))
      .limit(6);

    const result: PortfolioWithImages[] = [];
    for (const p of featured) {
      const images = await db
        .select()
        .from(portfolioImages)
        .where(eq(portfolioImages.portfolioId, p.id))
        .orderBy(portfolioImages.sortOrder);
      result.push({ ...p, images });
    }
    return result;
  } catch {
    return [];
  }
}
