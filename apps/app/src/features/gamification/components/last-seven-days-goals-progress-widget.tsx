import { getLastSevenDaysGoalsProgress } from "@/features/gamification/actions";

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

export async function LastSevenDaysGoalsProgressWidget() {
  const data = await getLastSevenDaysGoalsProgress();

  return (
    <div className="w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          Last 7 days
        </h3>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          Daily goal progress
        </span>
      </div>

      <div className="flex h-40 items-end justify-between gap-2">
        {data.map((d) => {
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
                  className="w-full rounded-md bg-gradient-to-t from-emerald-500 to-emerald-400/80 shadow-sm dark:from-emerald-600 dark:to-emerald-500"
                  style={{
                    height: `${heightPct}%`,
                    minHeight: 6,
                  }}
                />
              </div>
              <div
                className="text-[10px] font-medium tracking-wide text-zinc-600 dark:text-zinc-300"
                aria-label={`Progress for ${formatDate(d.date)}: ${heightPct}%`}
              >
                {heightPct}%
              </div>
              <div className="text-[10px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
