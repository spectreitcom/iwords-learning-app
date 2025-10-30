import { useQuery } from "@tanstack/react-query";
import { getUserGoal } from "@/features/gamification/actions";

export function useGamificationUserGoal() {
  return useQuery({
    queryKey: ["gamificationUserGoal"],
    queryFn: () => getUserGoal(),
    refetchInterval: 1000 * 30,
  });
}
