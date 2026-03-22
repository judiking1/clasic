"use server";

import { cache } from "react";
import { revalidatePath, unstable_cache } from "next/cache";
import { updateTag } from "next/cache";
import { db } from "@/lib/db";
import { portfolios, portfolioImages, pageViews } from "@/lib/db/schema";
import { eq, desc, asc, like, or, and, sql, inArray } from "drizzle-orm";
import { generateId, getPaginationValues } from "@/lib/utils";
import { portfolioSchema } from "@/lib/validations/portfolio";
import { deleteImage } from "./upload";
import type { ActionResult, PortfolioWithImages, PortfolioListItem, PaginatedResult } from "@/types";

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

    updateTag("portfolios");
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
    // Fetch old data BEFORE updating so we can diff image URLs
    const oldImages = await db
      .select()
      .from(portfolioImages)
      .where(eq(portfolioImages.portfolioId, id));
    const [oldPortfolio] = await db
      .select({ thumbnailUrl: portfolios.thumbnailUrl })
      .from(portfolios)
      .where(eq(portfolios.id, id))
      .limit(1);

    await db
      .update(portfolios)
      .set({
        ...parsed.data,
        thumbnailUrl,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(portfolios.id, id));

    // Only delete blobs for URLs that are no longer used
    const newUrlSet = new Set(imageUrls);
    if (thumbnailUrl) newUrlSet.add(thumbnailUrl);

    for (const img of oldImages) {
      if (!newUrlSet.has(img.imageUrl)) {
        await deleteImage(img.imageUrl);
      }
    }

    // Delete old thumbnailUrl blob if it changed and isn't reused
    const oldThumb = oldPortfolio?.thumbnailUrl;
    if (oldThumb && oldThumb !== thumbnailUrl && !newUrlSet.has(oldThumb)) {
      await deleteImage(oldThumb);
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

    updateTag("portfolios");
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

    updateTag("portfolios");
    revalidatePath("/portfolio");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete portfolio error:", error);
    return { success: false, error: "포트폴리오 삭제에 실패했습니다" };
  }
}

// Public paginated listing with imageCount & viewCount
async function _getPortfoliosPublic(
  category?: string,
  page?: number,
  pageSize?: number
): Promise<PaginatedResult<PortfolioListItem>> {
  const { page: p, pageSize: ps, offset } = getPaginationValues(page, pageSize);
  const empty: PaginatedResult<PortfolioListItem> = { data: [], total: 0, page: p, pageSize: ps, totalPages: 0 };

  try {
    const where = category && category !== "all"
      ? eq(portfolios.category, category)
      : undefined;

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(portfolios)
      .where(where);
    const total = countResult?.count ?? 0;
    if (total === 0) return empty;

    const rows = await db
      .select({
        id: portfolios.id,
        title: portfolios.title,
        category: portfolios.category,
        description: portfolios.description,
        thumbnailUrl: portfolios.thumbnailUrl,
        isFeatured: portfolios.isFeatured,
        createdAt: portfolios.createdAt,
      })
      .from(portfolios)
      .where(where)
      .orderBy(desc(portfolios.createdAt))
      .limit(ps)
      .offset(offset);

    const ids = rows.map((r) => r.id);

    // Batch fetch image counts
    const imageCounts = ids.length > 0
      ? await db
          .select({ portfolioId: portfolioImages.portfolioId, count: sql<number>`count(*)` })
          .from(portfolioImages)
          .where(inArray(portfolioImages.portfolioId, ids))
          .groupBy(portfolioImages.portfolioId)
      : [];

    // Batch fetch view counts (graceful fallback)
    let viewCounts: { page: string; count: number }[] = [];
    try {
      if (ids.length > 0) {
        viewCounts = await db
          .select({ page: pageViews.page, count: sql<number>`count(*)` })
          .from(pageViews)
          .where(inArray(pageViews.page, ids.map((id) => `/portfolio/${id}`)))
          .groupBy(pageViews.page);
      }
    } catch { /* page_views table may not exist yet */ }

    const imageCountMap = new Map(imageCounts.map((r) => [r.portfolioId, r.count]));
    const viewCountMap = new Map(viewCounts.map((r) => [r.page.replace("/portfolio/", ""), r.count]));

    const data: PortfolioListItem[] = rows.map((r) => ({
      ...r,
      description: r.description || "",
      thumbnailUrl: r.thumbnailUrl || "",
      imageCount: imageCountMap.get(r.id) ?? 0,
      viewCount: viewCountMap.get(r.id) ?? 0,
    }));

    return { data, total, page: p, pageSize: ps, totalPages: Math.ceil(total / ps) };
  } catch {
    return empty;
  }
}

// Cache indefinitely — only invalidated when admin creates/updates/deletes
export const getPortfoliosPublic = unstable_cache(
  _getPortfoliosPublic,
  ["portfolios-public"],
  { revalidate: false, tags: ["portfolios"] }
);

async function _getPortfolio(
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

// React.cache() deduplicates within a single request (metadata + page)
// unstable_cache() caches indefinitely — invalidated on admin mutation
export const getPortfolio = cache(
  (id: string) => unstable_cache(
    () => _getPortfolio(id),
    [`portfolio-${id}`],
    { revalidate: false, tags: ["portfolios", `portfolio-${id}`] }
  )()
);

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

    // Admin table only uses thumbnailUrl — skip fetching all images
    const data: PortfolioWithImages[] = rows.map((p) => ({
      ...p,
      images: [],
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

async function _getFeaturedPortfolios(): Promise<PortfolioWithImages[]> {
  try {
    const featured = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.isFeatured, true))
      .orderBy(desc(portfolios.createdAt))
      .limit(6);

    if (featured.length === 0) return [];

    const ids = featured.map((p) => p.id);
    const allImages = await db
      .select()
      .from(portfolioImages)
      .where(inArray(portfolioImages.portfolioId, ids))
      .orderBy(portfolioImages.sortOrder);

    const imageMap = new Map<string, typeof allImages>();
    for (const img of allImages) {
      const arr = imageMap.get(img.portfolioId) ?? [];
      arr.push(img);
      imageMap.set(img.portfolioId, arr);
    }

    return featured.map((p) => ({
      ...p,
      images: imageMap.get(p.id) ?? [],
    }));
  } catch {
    return [];
  }
}

export const getFeaturedPortfolios = unstable_cache(
  _getFeaturedPortfolios,
  ["featured-portfolios"],
  { revalidate: false, tags: ["portfolios"] }
);
