"use server";

import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";
import {
  DailyGoalProgress,
  GamificationUserGoal,
} from "@/features/gamification/types";

export async function getUserGoal() {
  const response = await authFetch(`${BACKEND_URL}/gamification/user-goal`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (await response.json()) as GamificationUserGoal;
}

export async function updateDailyGoal(goal: number) {
  await authFetch(`${BACKEND_URL}/gamification/goals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ goal }),
  });
}

export async function getLastSevenDaysGoalsProgress() {
  const response = await authFetch(
    `${BACKEND_URL}/gamification/goals/last-daily-goals-progress`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return (await response.json()) as DailyGoalProgress[];
}
