import { z } from "zod/v4";

export const sampleSchema = z.object({
  name: z.string().min(1, "샘플명을 입력해주세요"),
  brand: z.string().optional().default(""),
  colorCategory: z.string().optional().default("white"),
  patternType: z.string().optional().default("solid"),
  description: z.string().optional().default(""),
});

export type SampleInput = z.infer<typeof sampleSchema>;
