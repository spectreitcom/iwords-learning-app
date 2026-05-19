"use client";

import { RefreshCw } from "lucide-react";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { useLastSevenDaysGoalsProgress } from "@/features/gamification/hooks";

function formatWeekday(dateStr: string) {
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(d);
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function LastSevenDaysGoalsProgressWidget() {
  const { data, isPending, isLoading, isFetching, refetch } =
    useLastSevenDaysGoalsProgress();

  return (
    <div className="w-full rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Ostatnie 7 dni
        </h3>
        <div className="flex items-center gap-2">
          {(isPending || isLoading || isFetching) && (
            <Spinner className="h-4 w-4" />
          )}
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            title="Odśwież"
            aria-label="Refresh last 7 days progress"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Odśwież
          </button>
        </div>
      </div>

      <div className="flex h-40 items-end justify-between gap-2">
        {(isPending || isLoading) && (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner className="h-6 w-6" />
          </div>
        )}
        {!isPending &&
          !isLoading &&
          (data ?? []).map((d) => {
            const heightPct = Math.floor(d.progress * 100);
            const label = formatWeekday(d.date);
            return (
              <div
                key={d.date}
                className="flex w-full flex-col items-center gap-2"
              >
                <div
                  className="relative flex w-full items-end justify-center"
                  style={{ height: 120 }}
                >
                  <div
                    className="w-full rounded-md bg-gradient-to-t from-[oklch(0.58_0.15_158)] to-[oklch(0.74_0.13_158)] shadow-sm dark:from-[oklch(0.55_0.12_158)] dark:to-[oklch(0.78_0.12_158)]"
                    style={{
                      height: `${heightPct}%`,
                      minHeight: 6,
                    }}
                  />
                </div>
                <div
                  className="text-[10px] font-medium tracking-wide text-foreground"
                  aria-label={`Progress for ${formatDate(d.date)}: ${heightPct}%`}
                >
                  {heightPct}%
                </div>
                <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {label}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
