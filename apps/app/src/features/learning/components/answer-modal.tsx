"use client";

import { useEffect, useMemo, useRef } from "react";
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
import { sleep } from "@/lib/utils";

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

function randomSentence(sentences: GeneralAnswer["sentences"]) {
  return sentences[Math.floor(Math.random() * sentences.length)];
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

  const handleOk = () => {
    if (isSpeaking) return;
    onOk();
  };

  useEnterToContinue(open && !isSpeaking, onOk);

  const selectedSentence = useMemo(() => {
    if (!answerData?.sentences?.length) return null;
    return randomSentence(answerData.sentences);
  }, [answerData]);

  const lastSpokenRef = useRef<GeneralAnswer | null>(null);

  useEffect(() => {
    if (isAvailable && answerData && answerData !== lastSpokenRef.current) {
      lastSpokenRef.current = answerData;

      if (answerData.correctAnswer) {
        speak(answerData.correctAnswer);
        if (selectedSentence) {
          sleep(1000).then(() => speak(selectedSentence.content));
        }
      }
    } else if (!answerData) {
      lastSpokenRef.current = null;
    }
  }, [isAvailable, answerData, speak, selectedSentence]);

  if (!answerData) return null;

  const isCorrect = answerData.correct;

  return (
    <Dialog open={open} onOpenChange={() => handleOk()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`rounded-full p-2 border ${
                isCorrect ? "status-success" : "status-danger"
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="h-6 w-6 text-success" />
              ) : (
                <XCircle className="h-6 w-6 text-danger" />
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

        <div className="mt-2 space-y-2">
          {!isCorrect && (
            <div className="text-sm">
              <span className="text-muted-foreground">Twoja odpowiedź: </span>
              <span className="font-medium line-through decoration-destructive/60">
                {answerData.userAnswer || "(puste)"}
              </span>
            </div>
          )}
          <div className="text-sm">
            <span className="text-muted-foreground">Poprawna odpowiedź: </span>
            <span className="font-semibold text-success">
              {answerData.correctAnswer}
            </span>
          </div>

          {selectedSentence && (
            <div className="mt-4 border-t pt-4 space-y-2">
              <div className="text-sm font-medium leading-relaxed italic text-foreground">
                &quot;{selectedSentence.content}&quot;
              </div>
              <div className="text-xs text-muted-foreground">
                {selectedSentence.translation}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleOk} size="sm" disabled={isSpeaking}>
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

  const handleOk = () => {
    if (isSpeaking) return;
    onOk();
  };

  useEnterToContinue(open && !isSpeaking, onOk);

  const selectedSentence = useMemo(() => {
    if (!answerData?.sentences?.length) return null;
    return randomSentence(answerData.sentences);
  }, [answerData]);

  const lastSpokenRef = useRef<IrregularVerbAnswer | null>(null);

  useEffect(() => {
    if (isAvailable && answerData && answerData !== lastSpokenRef.current) {
      lastSpokenRef.current = answerData;

      if (answerData.form1 && answerData.form2 && answerData.form3) {
        speak(answerData.form1.correctAnswer);
        speak(answerData.form2.correctAnswer);
        speak(answerData.form3.correctAnswer);
        if (selectedSentence) {
          sleep(1000).then(() => speak(selectedSentence.content));
        }
      }
    } else if (!answerData) {
      lastSpokenRef.current = null;
    }
  }, [isAvailable, answerData, speak, selectedSentence]);

  if (!answerData) return null;

  const isAllCorrect = answerData.allCorrect;

  const forms = [
    { label: "Form I", data: answerData.form1 },
    { label: "Form II", data: answerData.form2 },
    { label: "Form III", data: answerData.form3 },
  ];

  return (
    <Dialog open={open} onOpenChange={() => handleOk()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`rounded-full p-2 border ${
                isAllCorrect ? "status-success" : "status-danger"
              }`}
            >
              {isAllCorrect ? (
                <CheckCircle2 className="h-6 w-6 text-success" />
              ) : (
                <XCircle className="h-6 w-6 text-danger" />
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
                  ok ? "status-success" : "status-danger"
                }`}
              >
                <BadgeCheck
                  className={`h-4 w-4 mt-0.5 shrink-0 ${
                    ok ? "text-success" : "text-danger"
                  }`}
                />
                <div className="flex-1">
                  <div className="font-medium">{f.label}</div>
                  <div className="space-y-1">
                    {!ok && (
                      <div>
                        <span className="text-muted-foreground text-xs">
                          Twoja odpowiedź:
                        </span>
                        <span className="font-medium line-through decoration-destructive/60 pl-1 text-xs">
                          {f.data.userAnswer || "(puste)"}
                        </span>
                      </div>
                    )}
                    <div className="text-sm">
                      <span className="text-muted-foreground">Poprawna: </span>
                      <span className="font-semibold text-success">
                        {f.data.correctAnswer}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedSentence && (
          <div className="mt-2 border-t pt-4 space-y-2">
            <div className="text-sm font-medium leading-relaxed italic text-foreground">
              &quot;{selectedSentence.content}&quot;
            </div>
            <div className="text-xs text-muted-foreground">
              {selectedSentence.translation}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={handleOk} size="sm" disabled={isSpeaking}>
            Dalej (ENTER)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
