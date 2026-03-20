import { db } from "@/lib/db";
import { portfolios } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { SITE_CONFIG } from "@/lib/constants";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let portfolioItems: { id: string; title: string; description: string; category: string; thumbnailUrl: string; createdAt: string; updatedAt: string }[] = [];

  try {
    portfolioItems = await db
      .select()
      .from(portfolios)
      .orderBy(desc(portfolios.createdAt))
      .limit(50);
  } catch {}

  const categoryMap: Record<string, string> = {
    kitchen: "주방/싱크대",
    bathroom: "욕실/세면대",
    counter: "카운터/상판",
    etc: "기타",
  };

  const rssItems = portfolioItems
    .map((p) => {
      const pubDate = new Date(p.createdAt).toUTCString();
      const category = categoryMap[p.category] || p.category;

      return `    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${baseUrl}/portfolio/${p.id}</link>
      <guid isPermaLink="true">${baseUrl}/portfolio/${p.id}</guid>
      <description><![CDATA[${p.description || `${SITE_CONFIG.name} ${category} 시공 사례`}]]></description>
      <category>${category}</category>
      <pubDate>${pubDate}</pubDate>${
        p.thumbnailUrl
          ? `
      <enclosure url="${p.thumbnailUrl}" type="image/jpeg" />`
          : ""
      }
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_CONFIG.name} - 인조대리석 전문 시공</title>
    <link>${baseUrl}</link>
    <description>${SITE_CONFIG.description}</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
