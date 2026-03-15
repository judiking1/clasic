import { z } from "zod/v4";

export const portfolioSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  description: z.string().optional().default(""),
  isFeatured: z.boolean().optional().default(false),
});

export type PortfolioInput = z.infer<typeof portfolioSchema>;
