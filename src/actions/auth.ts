"use server";

import { redirect } from "next/navigation";
import {
  verifyPassword,
  signToken,
  setAuthCookie,
  removeAuthCookie,
} from "@/lib/auth";
import type { ActionResult } from "@/types";

export async function loginAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const password = formData.get("password") as string;

  if (!password) {
    return { success: false, error: "비밀번호를 입력해주세요" };
  }

  const isValid = await verifyPassword(password);
  if (!isValid) {
    return { success: false, error: "비밀번호가 올바르지 않습니다" };
  }

  const token = await signToken();
  await setAuthCookie(token);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await removeAuthCookie();
  redirect("/admin/login");
}
