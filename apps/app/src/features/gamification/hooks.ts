import { useQuery } from "@tanstack/react-query";
import {
  getLastSevenDaysGoalsProgress,
  getUserGoal,
} from "@/features/gamification/actions";
import { DailyGoalProgress } from "@/features/gamification/types";

export function useGamificationUserGoal() {
  return useQuery({
    queryKey: ["gamificationUserGoal"],
    queryFn: () => getUserGoal(),
    refetchInterval: 1000 * 30,
  });
}

export function useLastSevenDaysGoalsProgress() {
  return useQuery<DailyGoalProgress[]>({
    queryKey: ["gamificationLastSevenDaysGoalsProgress"],
    queryFn: () => getLastSevenDaysGoalsProgress(),
    refetchInterval: 1000 * 60, // refresh once a minute
  });
}
