"use client";

import { useMemo } from "react";
import { Trophy, RefreshCw } from "lucide-react";
import { useGamificationUserGoal } from "@/features/gamification/hooks";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

export function UserGoalWidget() {
  const { data, isPending, isLoading, isFetching, isError, refetch } =
    useGamificationUserGoal();

  const percent = useMemo(() => {
    const goal = data?.goal ?? 0;
    const today = data?.todayPoints ?? 0;
    if (goal <= 0) return 0;
    return clamp(Math.round((today / goal) * 100));
  }, [data?.goal, data?.todayPoints]);

  return (
    <div className="flex items-center gap-3 min-w-[220px]">
      <Badge className="gap-2 px-3 py-1 rounded-md">
        <Trophy className="text-yellow-500" />
        <span className="font-medium">Daily goal</span>
      </Badge>

      <div className="w-40">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>{isPending || isLoading ? "Loading…" : `${percent}%`}</span>
          <span>
            {isPending || isLoading
              ? "—/—"
              : `${data?.todayPoints ?? 0}/${data?.goal ?? 0}`}
          </span>
        </div>
        <Progress value={percent} />
      </div>

      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              aria-label="Refresh goal"
              title="Refresh"
            >
              {isFetching ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>Refresh goal</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isError && (
        <span className="text-xs text-destructive">Failed to load</span>
      )}
    </div>
  );
}
