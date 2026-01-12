"use server";

import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";
import {
  dailyGoalProgressSchema,
  gamificationUserGoalSchema,
} from "@/features/gamification/types";
import { z } from "zod";

export async function getUserGoal() {
  try {
    const response = await authFetch(`${BACKEND_URL}/gamification/user-goal`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return gamificationUserGoalSchema.parse(data);
  } catch (error) {
    console.error("Error in getUserGoal:", error);
    throw error;
  }
}

export async function updateDailyGoal(goal: number) {
  try {
    await authFetch(`${BACKEND_URL}/gamification/goals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ goal }),
    });
  } catch (error) {
    console.error("Error in updateDailyGoal:", error);
    throw error;
  }
}

export async function getLastSevenDaysGoalsProgress() {
  try {
    const response = await authFetch(
      `${BACKEND_URL}/gamification/last-daily-goals-progress`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    return z.array(dailyGoalProgressSchema).parse(data);
  } catch (error) {
    console.error("Error in getLastSevenDaysGoalsProgress:", error);
    throw error;
  }
}
