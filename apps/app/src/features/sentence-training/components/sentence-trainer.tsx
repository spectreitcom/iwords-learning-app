"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { validateSentence } from "@/features/sentence-training/actions";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Props = Readonly<{
  expressionContextId: string;
  phrase: string;
  translation: string;
}>;

export function SentenceTrainer({
  expressionContextId,
  phrase,
  translation,
}: Props) {
  const [items, setItems] = useState<
    { userSentence: string; assistantResponse: string; score: number }[]
  >([]);
  const [inputValue, setInputValue] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const endOfListRef = useRef<HTMLDivElement | null>(null);

  const { isPending, mutate } = useMutation({
    mutationFn: ({
      userSentence,
      expressionContextId,
    }: {
      expressionContextId: string;
      userSentence: string;
    }) => {
      return validateSentence(expressionContextId, userSentence);
    },
    onSuccess: (res) => {
      setItems((items) => [
        ...items,
        {
          userSentence: inputRef.current?.value ?? inputValue,
          assistantResponse: res.answer,
          score: res.score,
        },
      ]);
      setInputValue("");
      inputRef.current && (inputRef.current.value = "");
    },
    onError: () => {
      toast.error("Ups! Coś poszło nie tak");
    },
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    endOfListRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [items.length]);

  const onSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    const sentence = (inputRef.current?.value ?? inputValue).trim();
    if (!sentence) return;
    mutate({ expressionContextId, userSentence: sentence });
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-2 text-sm text-muted-foreground">
          Trenujesz słówko
        </div>
        <div className="text-lg font-semibold">
          „{phrase}” - {translation}
        </div>
      </div>

      <div className="mb-6 max-h-72 space-y-3 overflow-auto rounded-lg border bg-white p-4">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Zatwierdź pierwsze zdanie, aby zobaczyć podpowiedź i wynik.
          </p>
        )}

        {items.map((item, index) => {
          const scoreColor =
            item.score >= 80
              ? "bg-emerald-100 text-emerald-800"
              : item.score >= 50
                ? "bg-amber-100 text-amber-800"
                : "bg-rose-100 text-rose-800";
          return (
            <div
              key={index}
              className="rounded-md border p-3 hover:bg-muted/40"
            >
              <div className="mb-1 flex items-center justify-between gap-3">
                <span className="text-sm font-medium">Twoje zdanie</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${scoreColor}`}
                >
                  Wynik: {item.score}
                </span>
              </div>
              <p className="mb-2 text-sm">{item.userSentence}</p>
              <div className="text-sm text-muted-foreground">
                Odpowiedź asystenta
              </div>
              <p className="mt-1 text-sm">{item.assistantResponse}</p>
            </div>
          );
        })}
        <div ref={endOfListRef} />
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <Input
          placeholder={`Napisz zdanie używając słówka \"${phrase}\" i naciśnij Enter`}
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isPending}
          aria-busy={isPending}
        />
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">Skrót: Enter</p>
          <Button
            className="ml-auto"
            disabled={isPending || inputValue.trim().length === 0}
            type="submit"
          >
            {isPending ? "Sprawdzanie..." : "Sprawdź"}
          </Button>
        </div>
      </form>
    </div>
  );
}
