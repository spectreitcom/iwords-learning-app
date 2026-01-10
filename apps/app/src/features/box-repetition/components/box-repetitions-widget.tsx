"use client";

import { getBoxRepetitions } from "@/features/box-repetition/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, Layers, RefreshCw } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { BoxRepetition } from "@/features/box-repetition/types";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

export function BoxRepetitionsWidget() {
  const [repetitions, setRepetitions] = useState<BoxRepetition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRepetitions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getBoxRepetitions();
      setRepetitions(data);
    } catch (error) {
      console.error("Failed to fetch repetitions:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRepetitions().then();
  }, [fetchRepetitions]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-500" />
            Powtórki
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchRepetitions}
            disabled={isLoading}
            title="Odśwież dane"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && repetitions.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {repetitions.map((box) => (
              <Link
                href={`/boxes/${box.boxId}`}
                key={box.boxId}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-indigo-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-indigo-700"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h4 className="font-semibold leading-none tracking-tight text-zinc-900 dark:text-zinc-100">
                      {box.title}
                    </h4>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {box.expressionsCount} wyrażeń
                    </p>
                  </div>
                  {box.isFinished ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-zinc-300 dark:text-zinc-700 shrink-0" />
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                      {box.repetitionCount}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Powtórek
                    </span>
                  </div>
                  {!box.isFinished && (
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div
                        className="h-full bg-indigo-500 transition-all"
                        style={{
                          width: `${Math.min((box.repetitionCount / 20) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  )}
                </div>

                <div
                  className={`absolute inset-x-0 bottom-0 h-1 transition-colors ${
                    box.isFinished
                      ? "bg-emerald-500"
                      : "bg-indigo-500 opacity-0 group-hover:opacity-100"
                  }`}
                />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
