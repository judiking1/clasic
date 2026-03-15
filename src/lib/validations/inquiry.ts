import { z } from "zod/v4";

export const inquirySchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  phone: z
    .string()
    .min(1, "연락처를 입력해주세요")
    .regex(/^[\d-]+$/, "올바른 연락처를 입력해주세요"),
  email: z.union([z.email("올바른 이메일을 입력해주세요"), z.literal("")]).optional().default(""),
  inquiryType: z.string().min(1, "문의 유형을 선택해주세요"),
  message: z.string().min(1, "문의 내용을 입력해주세요"),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
