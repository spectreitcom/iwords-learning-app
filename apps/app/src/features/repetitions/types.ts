export type RepetitionExpressionContextType =
  | "verb"
  | "noun"
  | "adjective"
  | "adverb"
  | "phrasal_verb"
  | "irregular_verb";

export type RepetitionExpressionContext = {
  expressionContextId: string;
  expressionId: string;
  phrase: string;
  translation: string;
  type: RepetitionExpressionContextType;
  forms: string[];
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
