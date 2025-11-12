import { ExpressionContextType } from "@/lib/types";

export type RepetitionExpressionContext = {
  expressionContextId: string;
  expressionId: string;
  phrase: string;
  translation: string;
  type: ExpressionContextType;
  forms: [string, string, string] | null;
  isCountable: boolean;
  isIrregular: boolean;
  sentences: {
    sentenceId: string;
    content: string;
    translation: string;
  }[];
};

export type Repetition = {
  repetitionId: string;
  expressionContext: RepetitionExpressionContext;
};
