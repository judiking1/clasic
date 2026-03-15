import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { portfolios, samples } from "@/lib/db/schema";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/samples`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  let portfolioPages: MetadataRoute.Sitemap = [];
  let samplePages: MetadataRoute.Sitemap = [];

  try {
    const allPortfolios = await db.select().from(portfolios);
    portfolioPages = allPortfolios.map((p) => ({
      url: `${baseUrl}/portfolio/${p.id}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {}

  try {
    const allSamples = await db.select().from(samples);
    samplePages = allSamples.map((s) => ({
      url: `${baseUrl}/samples/${s.id}`,
      lastModified: new Date(s.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {}

  return [...staticPages, ...portfolioPages, ...samplePages];
}
