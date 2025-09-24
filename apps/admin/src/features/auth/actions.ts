"use server";

import { loginSchema, LoginSchema } from "@/features/auth/schemas";
import { BACKEND_URL } from "@/lib/constants";
import { LoginResponse } from "@/features/auth/types";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function login(payload: LoginSchema) {
  const validationRes = await loginSchema.safeParse(payload);
  if (!validationRes.success) return { error: true };

  const response = await fetch(`${BACKEND_URL}/auth/sign-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validationRes.data),
  });

  if (response.status !== 200) return { error: true };

  const data = (await response.json()) as LoginResponse;

  await createSession({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    email: data.user.email,
    name: data.user.name,
    id: data.user.id,
  });

  revalidatePath("/");
  redirect("/");
}
