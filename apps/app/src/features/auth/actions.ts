"use server";

import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";
import { CurrentLoggedUser } from "@/features/auth/types";

export async function getMe() {
  const response = await authFetch(`${BACKEND_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (await response.json()) as CurrentLoggedUser;
}
