"use server";

import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";
import { currentLoggedUserSchema } from "@/features/auth/types";

export async function getMe() {
  try {
    const response = await authFetch(`${BACKEND_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return currentLoggedUserSchema.parse(data);
  } catch (error) {
    console.error("Error in getMe:", error);
    throw error;
  }
}
