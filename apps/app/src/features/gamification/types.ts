import { z } from "zod";

export const gamificationUserGoalSchema = z.object({
  goal: z.number(),
  todayPoints: z.number(),
});

export type GamificationUserGoal = z.infer<typeof gamificationUserGoalSchema>;

export const dailyGoalProgressSchema = z.object({
  date: z.string(),
  progress: z.number(),
});

export type DailyGoalProgress = z.infer<typeof dailyGoalProgressSchema>;
