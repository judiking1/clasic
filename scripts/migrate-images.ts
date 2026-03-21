/**
 * Migration script: Move base64 images from Turso DB to Vercel Blob Storage
 *
 * Usage:
 *   npx tsx scripts/migrate-images.ts
 *
 * Required env vars:
 *   TURSO_DATABASE_URL
 *   TURSO_AUTH_TOKEN
 *   BLOB_READ_WRITE_TOKEN
 */

import { createClient } from "@libsql/client";
import { put } from "@vercel/blob";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("❌ BLOB_READ_WRITE_TOKEN is required. Set it in .env.local");
  process.exit(1);
}

async function migrateTable(
  table: string,
  idCol: string,
  urlCol: string
) {
  console.log(`\n📦 Migrating ${table}.${urlCol}...`);

  const rows = await db.execute(
    `SELECT ${idCol}, ${urlCol} FROM ${table} WHERE ${urlCol} LIKE 'data:%'`
  );

  console.log(`   Found ${rows.rows.length} base64 images to migrate`);

  let success = 0;
  let failed = 0;

  for (const row of rows.rows) {
    const id = row[idCol] as string;
    const dataUrl = row[urlCol] as string;

    try {
      // Parse data URL: data:image/jpeg;base64,/9j/4AAQ...
      const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) {
        console.log(`   ⚠️ Skipping ${id}: not a valid data URL`);
        failed++;
        continue;
      }

      const mimeType = match[1];
      const base64Data = match[2];
      const buffer = Buffer.from(base64Data, "base64");

      // Determine file extension
      const ext = mimeType === "image/png" ? "png"
        : mimeType === "image/webp" ? "webp"
        : "jpg";

      const filename = `${table}/${id}.${ext}`;

      // Upload to Vercel Blob
      const blob = await put(filename, buffer, {
        access: "public",
        contentType: mimeType,
      });

      // Update DB with new URL
      await db.execute({
        sql: `UPDATE ${table} SET ${urlCol} = ? WHERE ${idCol} = ?`,
        args: [blob.url, id],
      });

      success++;
      console.log(`   ✅ ${id} → ${blob.url} (${(buffer.length / 1024).toFixed(1)} KB)`);
    } catch (error) {
      failed++;
      console.error(`   ❌ ${id}: ${error}`);
    }
  }

  console.log(`   Done: ${success} migrated, ${failed} failed`);
}

async function main() {
  console.log("🚀 Starting image migration: base64 → Vercel Blob\n");

  // Migrate portfolio_images.image_url
  await migrateTable("portfolio_images", "id", "image_url");

  // Migrate portfolios.thumbnail_url
  await migrateTable("portfolios", "id", "thumbnail_url");

  // Migrate samples.image_url
  await migrateTable("samples", "id", "image_url");

  console.log("\n✨ Migration complete!");
}

main().catch(console.error);
