import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const portfolios = sqliteTable("portfolios", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull().default(""),
  thumbnailUrl: text("thumbnail_url").notNull().default(""),
  isFeatured: integer("is_featured", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const portfolioImages = sqliteTable("portfolio_images", {
  id: text("id").primaryKey(),
  portfolioId: text("portfolio_id")
    .notNull()
    .references(() => portfolios.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  altText: text("alt_text").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const samples = sqliteTable("samples", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull().default(""),
  colorCategory: text("color_category").notNull().default("white"),
  patternType: text("pattern_type").notNull().default("solid"),
  imageUrl: text("image_url").notNull().default(""),
  description: text("description").notNull().default(""),
  createdAt: text("created_at").notNull(),
});

export const inquiries = sqliteTable("inquiries", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull().default(""),
  inquiryType: text("inquiry_type").notNull(),
  message: text("message").notNull(),
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull(),
});
