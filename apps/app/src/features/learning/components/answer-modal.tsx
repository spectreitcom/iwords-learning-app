"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@repo/ui/components/ui/dialog";
import { Button } from "@repo/ui/components/ui/button";
import { BadgeCheck, CheckCircle2, XCircle } from "lucide-react";
import { GeneralAnswer, IrregularVerbAnswer } from "@/features/learning/types";
import { usePronunciation } from "@/hooks/use-pronunciation";

function useEnterToContinue(enabled: boolean, onOk: () => void) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onOk();
      }
    };

    globalThis.addEventListener("keydown", handler);
    return () => globalThis.removeEventListener("keydown", handler);
  }, [enabled, onOk]);
}

export function AnswerModal({
  answerData,
  onOk,
}: Readonly<{
  answerData: GeneralAnswer | null;
  onOk: () => void;
}>) {
  const open = !!answerData;
  const { isAvailable, speak, isSpeaking } = usePronunciation("en-US");
  useEnterToContinue(open, onOk);

  useEffect(() => {
    if (isAvailable && answerData?.correctAnswer)
      speak(answerData.correctAnswer);
  }, [isAvailable, answerData]);

  if (!answerData) return null;

  const isCorrect = answerData.correct;

  return (
    <Dialog open={open} onOpenChange={() => onOk()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`rounded-full p-2 border ${
                isCorrect
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-rose-50 border-rose-200"
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              ) : (
                <XCircle className="h-6 w-6 text-rose-600" />
              )}
            </div>
            <div>
              <DialogTitle>
                {isCorrect
                  ? "Gratuluję - Twoja odpowiedź jest poprawna"
                  : "Ups! - Popełniłeś błąd"}
              </DialogTitle>
              <DialogDescription>
                {isCorrect
                  ? "Świetna robota! Kontynuuj naukę."
                  : "Zerknij na poprawną odpowiedź i spróbuj zapamiętać."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {!isCorrect && (
          <div className="mt-2 space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Twoja odpowiedź: </span>
              <span className="font-medium line-through decoration-rose-500/60">
                {answerData.userAnswer || "(puste)"}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">
                Poprawna odpowiedź:{" "}
              </span>
              <span className="font-semibold text-emerald-700">
                {answerData.correctAnswer}
              </span>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={onOk} size="sm" disabled={isSpeaking}>
            Dalej (ENTER)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function IrregularVerbAnswerModal({
  answerData,
  onOk,
}: Readonly<{
  answerData: IrregularVerbAnswer | null;
  onOk: () => void;
}>) {
  const open = !!answerData;
  const { isAvailable, speak, isSpeaking } = usePronunciation("en-US");
  useEnterToContinue(open, onOk);

  useEffect(() => {
    if (
      isAvailable &&
      answerData?.form1 &&
      answerData?.form2 &&
      answerData?.form3
    ) {
      speak(answerData.form1.correctAnswer);
      speak(answerData.form2.correctAnswer);
      speak(answerData.form3.correctAnswer);
    }
  }, [isAvailable, answerData]);

  if (!answerData) return null;

  const isAllCorrect = answerData.allCorrect;

  const forms = [
    { label: "Form I", data: answerData.form1 },
    { label: "Form II", data: answerData.form2 },
    { label: "Form III", data: answerData.form3 },
  ];

  return (
    <Dialog open={open} onOpenChange={() => onOk()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`rounded-full p-2 border ${
                isAllCorrect
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-rose-50 border-rose-200"
              }`}
            >
              {isAllCorrect ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              ) : (
                <XCircle className="h-6 w-6 text-rose-600" />
              )}
            </div>
            <div>
              <DialogTitle>
                {isAllCorrect
                  ? "Gratuluję - Twoja odpowiedź jest poprawna"
                  : "Ups! - Popełniłeś błąd"}
              </DialogTitle>
              <DialogDescription>
                {isAllCorrect
                  ? "Świetna robota!"
                  : "Popraw swoje odpowiedzi na poniższe formy."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-2 grid gap-3">
          {forms.map((f) => {
            const ok = f.data.correct;
            return (
              <div
                key={f.label}
                className={`rounded-md border p-3 text-sm flex items-start gap-3 ${
                  ok
                    ? "bg-emerald-50/50 border-emerald-200"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              >
                <BadgeCheck
                  className={`h-4 w-4 mt-0.5 shrink-0 ${
                    ok ? "text-emerald-600" : "text-rose-600"
                  }`}
                />
                <div className="flex-1">
                  <div className="font-medium">{f.label}</div>
                  {ok ? (
                    <div className="text-muted-foreground">Poprawnie</div>
                  ) : (
                    <div className="space-y-1">
                      <div>
                        <span className="text-muted-foreground">
                          Twoja odpowiedź:
                        </span>
                        <span className="font-medium line-through decoration-rose-500/60">
                          {f.data.userAnswer || "(puste)"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Poprawna odpowiedź:
                        </span>
                        <span className="font-semibold text-emerald-700">
                          {f.data.correctAnswer}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button onClick={onOk} size="sm" disabled={isSpeaking}>
            Dalej (ENTER)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
