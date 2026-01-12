"use server";

import { loginSchema, LoginSchema } from "@/features/auth/schemas";
import { BACKEND_URL, SELF_URL } from "@/lib/constants";
import { loginResponseSchema } from "@/features/auth/types";
import { createSession, getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function login(payload: LoginSchema) {
  try {
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

    const responseData = await response.json();
    const data = loginResponseSchema.parse(responseData);

    await createSession({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      email: data.user.email,
      name: data.user.name,
      id: data.user.adminUserId,
    });

    revalidatePath("/");
    redirect("/");
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Error in login:", error);
    return { error: true };
  }
}

export async function refreshToken() {
  try {
    const session = await getSession();

    if (!session) throw new Error("No session");

    const response = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });

    if (!response.ok) throw new Error("Failed to refresh token");

    const responseData = await response.json();
    const { accessToken, refreshToken, user } =
      loginResponseSchema.parse(responseData);

    const updateRes = await fetch(`${SELF_URL}/api/auth/update`, {
      method: "POST",
      body: JSON.stringify({ accessToken, refreshToken, user }),
    });

    if (!updateRes.ok) throw new Error("Failed to update session");

    return accessToken;
  } catch (error) {
    console.error("Error in refreshToken:", error);
    throw error;
  }
}
