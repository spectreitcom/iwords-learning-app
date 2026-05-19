"use client";

import { useMemo, useState } from "react";
import { Trophy, RefreshCw, Pencil } from "lucide-react";
import { useGamificationUserGoal } from "@/features/gamification/hooks";
import { Badge } from "@repo/ui/components/ui/badge";
import { Progress } from "@repo/ui/components/ui/progress";
import { Spinner } from "@repo/ui/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@repo/ui/components/ui/dialog";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { useForm } from "react-hook-form";
import { updateDailyGoal } from "@/features/gamification/actions";

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

  const [open, setOpen] = useState(false);

  type FormValues = { goal: number };
  const form = useForm<FormValues>({
    defaultValues: { goal: data?.goal ?? 10 },
    mode: "onSubmit",
  });

  // Keep form default in sync when data changes (first open)
  const handleOpenChange = (next: boolean) => {
    if (next) {
      form.reset({ goal: data?.goal ?? 10 });
    }
    setOpen(next);
  };

  const onSubmit = async (values: FormValues) => {
    const normalized = Number(values.goal);
    if (!Number.isFinite(normalized) || normalized <= 0) {
      form.setError("goal", {
        type: "validate",
        message: "Enter a positive number",
      });
      return;
    }
    try {
      await updateDailyGoal(Math.round(normalized));
      setOpen(false);
      await refetch();
    } catch {
      form.setError("goal", {
        type: "server",
        message: "Failed to update. Try again.",
      });
    }
  };

  return (
    <div className="flex items-center gap-3 min-w-[260px]">
      <Badge className="gap-2 px-3 py-1 rounded-md">
        <Trophy className="text-[oklch(0.78_0.15_78)]" />
        <span className="font-medium">Dzienny cel</span>
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
              aria-label="Odśwież"
              title="Odśwież"
            >
              {isFetching ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>Odśwież cel</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => handleOpenChange(true)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              aria-label="Ustaw dzienny cel"
              title="Ustaw cel"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Ustaw swój dzienny cel</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isError && <span className="text-xs text-destructive">Błąd</span>}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ustaw swój dzienny cel</DialogTitle>
            <DialogDescription>
              Wybierz ile punktów dziennie chcesz osiągnąć.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dzienny cel (punkty)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={500}
                        step={1}
                        inputMode="numeric"
                        value={
                          typeof field.value === "number" &&
                          Number.isFinite(field.value)
                            ? field.value
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(e.currentTarget.valueAsNumber)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  Anuluj
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Zapisuję…" : "Zapisz"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
