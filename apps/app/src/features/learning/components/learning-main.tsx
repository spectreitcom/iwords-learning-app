"use client";

import { BoxItem } from "@/features/boxes/types";
import { Progress } from "@/components/ui/progress";
import { SimpleTranslationView } from "@/features/learning/components/simple-translation-view";
import { LinkedList, LinkedListNode } from "@/lib/linked-list";
import { useEffect, useRef, useState } from "react";
import {
  GeneralAnswer,
  IrregularVerbAnswer,
  LearningViewType,
} from "@/features/learning/types";
import { SentenceTranslationView } from "@/features/learning/components/sentence-translation-view";
import { IrregularVerbTranslationView } from "@/features/learning/components/irregular-verb-translation-view";
import {
  AnswerModal,
  IrregularVerbAnswerModal,
} from "@/features/learning/components/answer-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ExpressionContextType } from "@/lib/types";
import { expressionTypeMap } from "@/features/boxes/utils";
import { finishBox } from "@/features/boxes/actions";

type Props = Readonly<{
  boxItems: BoxItem[];
  title?: string;
  boxId?: string;
  repetitionMode?: boolean;
}>;

type ListData = {
  learningViewType: LearningViewType;
  translation: string;
  expressionContextId?: string;
  sentenceId?: string;
  expressionContextType: ExpressionContextType;
};

function getLearningViewType(
  expressionContextType: ExpressionContextType,
): LearningViewType {
  switch (expressionContextType) {
    case "irregular_verb":
      return "IRREGULAR_VERB_TRANSLATION_VIEW";
    default:
      return "SIMPLE_TRANSLATION_VIEW";
  }
}

function calcProgress(currentIndex: number, totalItems: number): number {
  if (totalItems <= 0) return 0;
  return Math.round((currentIndex / totalItems) * 100);
}

export function LearningMain({
  boxItems,
  title,
  boxId,
  repetitionMode,
}: Props) {
  const [currentItem, setCurrentItem] =
    useState<LinkedListNode<ListData> | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerData, setAnswerData] = useState<GeneralAnswer | null>(null);
  const [irregularVerbAnswerData, setIrregularVerbAnswerData] =
    useState<IrregularVerbAnswer | null>(null);

  const router = useRouter();

  const linkedListRef = useRef(new LinkedList<ListData>());

  useEffect(() => {
    linkedListRef.current = new LinkedList<ListData>();

    const linkedList = linkedListRef.current;

    for (const item of boxItems) {
      linkedList.append({
        expressionContextId: item.expressionContextId,
        translation: item.translation,
        learningViewType: getLearningViewType(item.type),
        expressionContextType: item.type,
      });

      // for (const sentence of item.sentences) {
      //   linkedList.append({
      //     sentenceId: sentence.sentenceId,
      //     translation: sentence.translation,
      //     learningViewType: "SENTENCE_TRANSLATION_VIEW",
      //   });
      // }
    }

    setCurrentItem(linkedList.getHead());
  }, [boxId, boxItems]);

  const canShowSummary =
    currentIndex > 0 && currentIndex > linkedListRef.current.length - 1;

  if (canShowSummary) {
    return (
      <LearningSummary
        repetitionMode={repetitionMode}
        title={title ?? ""}
        learned={currentIndex}
        total={linkedListRef.current.length}
        boxId={boxId}
        onBackToBox={() => router.push(`/boxes/${boxId}`)}
        onRestart={() => {
          setCurrentItem(linkedListRef.current.getHead());
          setCurrentIndex(0);
        }}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-2xl font-semibold tracking-tight">{title}</div>
        <div className="mt-1 text-sm text-muted-foreground">
          Krok{" "}
          {Math.min(
            currentIndex + 1,
            Math.max(linkedListRef.current.length, 1),
          )}{" "}
          z {linkedListRef.current.length}
        </div>
      </div>

      {/* Lesson progress */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Postęp</span>
          <span>
            {calcProgress(currentIndex, linkedListRef.current.length)}%
          </span>
        </div>
        <Progress
          value={calcProgress(currentIndex, linkedListRef.current.length)}
        />
      </div>

      {/* Exercise card */}
      <Card className="mt-8">
        {currentItem && (
          <CardContent className="p-6">
            {/* Translation */}
            <div className="text-center">
              <h3 className="text-3xl font-semibold tracking-tight">
                {currentItem.value.translation}
              </h3>
              <span className={"italic"}>
                (
                {expressionTypeMap.get(currentItem.value.expressionContextType)}
                )
              </span>
            </div>

            {/* Translation view */}
            <div className="mt-6">
              {currentItem && (
                <>
                  <SimpleTranslationView
                    currentView={currentItem?.value.learningViewType}
                    expressionContextId={
                      currentItem.value?.expressionContextId ?? ""
                    }
                    onAnswerChecked={(res) => {
                      setAnswerData(res);
                    }}
                  />
                  <SentenceTranslationView
                    currentView={currentItem.value.learningViewType}
                    sentenceId={currentItem.value?.sentenceId ?? ""}
                    onAnswerChecked={(res) => {
                      setAnswerData(res);
                    }}
                  />
                  <IrregularVerbTranslationView
                    currentView={currentItem.value.learningViewType}
                    expressionContextId={
                      currentItem.value?.expressionContextId ?? ""
                    }
                    onAnswerChecked={(res) => {
                      setIrregularVerbAnswerData(res);
                    }}
                  />
                </>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Modals */}
      <AnswerModal
        answerData={answerData}
        onOk={() => {
          setAnswerData(null);
          if (!currentItem) return;
          if (currentItem.next) {
            setCurrentItem(currentItem.next);
          }
          setCurrentIndex(currentIndex + 1);
        }}
      />

      <IrregularVerbAnswerModal
        answerData={irregularVerbAnswerData}
        onOk={() => {
          setIrregularVerbAnswerData(null);
          if (!currentItem) return;
          if (currentItem.next) {
            setCurrentItem(currentItem.next);
          }
          setCurrentIndex(currentIndex + 1);
        }}
      />
    </div>
  );
}

function LearningSummary({
  title,
  learned,
  total,
  onBackToBox,
  onRestart,
  repetitionMode,
  boxId,
}: Readonly<{
  title: string;
  learned: number;
  total: number;
  onBackToBox: () => void;
  onRestart: () => void;
  repetitionMode?: boolean;
  boxId?: string;
}>) {
  const percent = total > 0 ? Math.round((learned / total) * 100) : 0;

  const isFinishedBoxFnInvoked = useRef(false);

  useEffect(() => {
    if (boxId && !repetitionMode && !isFinishedBoxFnInvoked.current) {
      isFinishedBoxFnInvoked.current = true;
      finishBox(boxId).then();
    }
  }, [boxId, repetitionMode]);

  return (
    <div className="max-w-xl mx-auto mt-16">
      <Card className="text-center">
        <CardContent className="py-10">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
            <Trophy className="w-10 h-10 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-semibold">Lekcja ukończona!</h3>
          <p className="text-muted-foreground mt-1">{title}</p>

          <div className="mt-6">
            <div className="text-5xl font-bold tracking-tight">{percent}%</div>
            <div className="text-sm text-muted-foreground mt-1">
              Ukończono {learned} z {total} kroków
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            {!repetitionMode && (
              <Button variant="secondary" onClick={onBackToBox}>
                Wróć do boxa
              </Button>
            )}
            <Button onClick={onRestart}>Zacznij od nowa</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
