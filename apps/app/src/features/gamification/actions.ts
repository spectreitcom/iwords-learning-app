"use server";

import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";
import { GamificationUserGoal } from "@/features/gamification/types";

export async function getUserGoal() {
  const response = await authFetch(`${BACKEND_URL}/gamification/user-goal`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (await response.json()) as GamificationUserGoal;
}
