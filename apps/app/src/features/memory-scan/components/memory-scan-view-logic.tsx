"use client";

import type { MemoryScanView } from "@/features/memory-scan/types";
import { saveMemoryScanResult } from "@/features/memory-scan/actions";
import { useEffect, useState } from "react";
import { ChevronDown, RotateCcw, Timer } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { toast } from "sonner";
import { cn } from "@repo/ui/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";

const DURATION_OPTIONS = [1, 3, 5, 10, 15, 20];
const DEFAULT_DURATION = 3;

type Props = Readonly<{
  viewData: MemoryScanView;
}>;

export function MemoryScanViewLogic({ viewData }: Props) {
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [remainingSeconds, setRemainingSeconds] = useState(
    DEFAULT_DURATION * 60,
  );
  const [showItems, setShowItems] = useState(false);
  const [isBrowsing, setIsBrowsing] = useState(false);
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [rememberedItemIds, setRememberedItemIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  function handleRestart() {
    if (isSaving) return;

    setEndsAt(null);
    setRemainingSeconds(duration * 60);
    setShowItems(false);
    setIsBrowsing(false);
    setRememberedItemIds(new Set());
    setIsSaved(false);
  }

  async function handleSave() {
    if (isSaving || isSaved) return;

    setIsSaving(true);
    try {
      await saveMemoryScanResult(rememberedItemIds.size, duration * 60);
      setIsSaved(true);
      toast.success("Wynik skanu pamięci został zapisany.");
    } catch {
      toast.error("Nie udało się zapisać wyniku. Spróbuj ponownie.");
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    if (endsAt === null) return;

    const updateRemainingTime = () => {
      // Use elapsed time so inactive tabs and device sleep do not delay completion.
      const seconds = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setRemainingSeconds(seconds);

      if (seconds === 0) window.clearInterval(intervalId);
    };
    const intervalId = window.setInterval(updateRemainingTime, 250);
    document.addEventListener("visibilitychange", updateRemainingTime);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", updateRemainingTime);
    };
  }, [endsAt]);

  const isFinished = remainingSeconds === 0;
  const minutes = Math.floor(remainingSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (remainingSeconds % 60).toString().padStart(2, "0");

  if (showItems || isBrowsing) {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Wyuczone elementy</CardTitle>
          <CardDescription>
            {isBrowsing
              ? "Przeglądaj wyuczone słówka i historię wyników bez odliczania."
              : "Zaznacz wyrażenia, które udało Ci się przypomnieć."}
          </CardDescription>
          {!isBrowsing && (
            <p role="status" className="text-sm font-medium text-primary">
              Przypomniane: {rememberedItemIds.size} z{" "}
              {viewData.learnedItems.length}
            </p>
          )}
          {isBrowsing && (
            <Button variant="outline" onClick={handleRestart}>
              <Timer aria-hidden="true" />
              Wróć do timera
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {viewData.learnedItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nie masz jeszcze wyuczonych elementów.
            </p>
          ) : (
            <ul className="space-y-3">
              {viewData.learnedItems.map(
                ({ expression, expressionContext }) => (
                  <li
                    key={expressionContext.id}
                    className={cn(
                      "surface-subtle rounded-xl border transition-colors",
                      rememberedItemIds.has(expressionContext.id) &&
                        "border-primary/40 bg-primary/5",
                    )}
                  >
                    <label
                      className={cn(
                        "flex items-start gap-3 p-4",
                        !isBrowsing && "cursor-pointer",
                      )}
                    >
                      {!isBrowsing && (
                        <Checkbox
                          className="mt-1"
                          disabled={isSaving || isSaved}
                          checked={rememberedItemIds.has(expressionContext.id)}
                          onCheckedChange={(checked) => {
                            setRememberedItemIds((previous) => {
                              const next = new Set(previous);
                              if (checked === true) {
                                next.add(expressionContext.id);
                              } else {
                                next.delete(expressionContext.id);
                              }
                              return next;
                            });
                          }}
                        />
                      )}
                      <span className="min-w-0 space-y-1">
                        <span className="block break-words font-medium">
                          {expression.phrase}
                        </span>
                        <span className="block break-words text-sm text-muted-foreground">
                          {expressionContext.translation}
                        </span>
                      </span>
                    </label>
                  </li>
                ),
              )}
            </ul>
          )}
          {!isBrowsing && viewData.learnedItems.length > 0 && (
            <Button
              className="mt-6 w-full"
              onClick={handleSave}
              disabled={isSaving || isSaved}
              aria-busy={isSaving}
            >
              {isSaving && <Spinner />}
              {isSaved ? "Zapisano" : isSaving ? "Zapisywanie…" : "Save"}
            </Button>
          )}
          {!isBrowsing && (
            <Button
              variant="outline"
              className="mt-3 w-full"
              onClick={handleRestart}
              disabled={isSaving}
            >
              <RotateCcw aria-hidden="true" />
              Restart
            </Button>
          )}
          <ScanResults results={viewData.scanResults} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="text-center">
        <Timer
          className="mx-auto mb-2 size-6 text-primary"
          aria-hidden="true"
        />
        <CardTitle>Skan pamięci</CardTitle>
        <CardDescription>
          Przypomnij sobie jak najwięcej wyuczonych wyrażeń, zanim upłynie czas.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              aria-label={`Czas odliczania: ${duration} min`}
            >
              {duration} min
              <ChevronDown aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuRadioGroup
              value={String(duration)}
              onValueChange={(value) => {
                const nextDuration = Number(value);
                if (nextDuration === duration) return;
                setEndsAt(null);
                setDuration(nextDuration);
                setRemainingSeconds(nextDuration * 60);
              }}
            >
              {DURATION_OPTIONS.map((option) => (
                <DropdownMenuRadioItem key={option} value={String(option)}>
                  {option} min
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div
          role="timer"
          aria-label="Pozostały czas"
          className="text-6xl font-semibold tracking-tight tabular-nums sm:text-7xl"
        >
          {minutes}:{seconds}
        </div>
        <p role="status" className="text-center text-sm text-muted-foreground">
          {isFinished
            ? "Czas minął. Możesz teraz sprawdzić elementy."
            : endsAt === null
              ? "Wybierz czas i rozpocznij odliczanie."
              : "Zmiana czasu zatrzyma i zresetuje odliczanie."}
        </p>
        {endsAt === null && (
          <Button
            className="w-full"
            onClick={() => setEndsAt(Date.now() + duration * 60_000)}
          >
            Rozpocznij odliczanie
          </Button>
        )}
        {isFinished && (
          <Button className="w-full" onClick={() => setShowItems(true)}>
            Pokaż elementy
          </Button>
        )}
        {endsAt !== null && (
          <Button variant="outline" className="w-full" onClick={handleRestart}>
            <RotateCcw aria-hidden="true" />
            Restart
          </Button>
        )}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            handleRestart();
            setIsBrowsing(true);
          }}
        >
          Pokaż słówka i historię wyników
        </Button>
      </CardContent>
    </Card>
  );
}

export function ScanResults({
  results,
}: Readonly<{ results: MemoryScanView["scanResults"] }>) {
  const sortedResults = [...results].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );

  return (
    <section className="mt-8 space-y-3 border-t pt-6">
      <h2 className="text-lg font-semibold">Historia wyników</h2>
      {sortedResults.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nie masz jeszcze zapisanych wyników skanu pamięci.
        </p>
      ) : (
        <Table aria-label="Historia wyników skanu pamięci">
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Przypomniane</TableHead>
              <TableHead>Czas (min:sek)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedResults.map((result, index) => (
              <TableRow key={`${result.createdAt.toISOString()}-${index}`}>
                <TableCell>
                  <time dateTime={result.createdAt.toISOString()}>
                    {result.createdAt.toLocaleString("pl-PL", {
                      dateStyle: "short",
                      timeStyle: "short",
                      timeZone: "Europe/Warsaw",
                    })}
                  </time>
                </TableCell>
                <TableCell className="tabular-nums">
                  {result.rememberedItemsCount} z {result.itemsCount}
                </TableCell>
                <TableCell className="tabular-nums">
                  {Math.floor(result.rememberingTime / 60)}:
                  {String(result.rememberingTime % 60).padStart(2, "0")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
