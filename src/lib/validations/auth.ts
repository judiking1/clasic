import { z } from "zod/v4";

export const loginSchema = z.object({
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

export type LoginInput = z.infer<typeof loginSchema>;
