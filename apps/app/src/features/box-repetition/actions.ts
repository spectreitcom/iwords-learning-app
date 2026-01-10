"use server";

import { BoxRepetition } from "@/features/box-repetition/types";
import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";

export async function getBoxRepetitions(): Promise<BoxRepetition[]> {
  const response = await authFetch(`${BACKEND_URL}/boxes/today`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
}
