export type RepetitionExpressionContext = {
  expressionContextId: string;
  expressionId: string;
  phrase: string;
  translation: string;
  type: string;
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
