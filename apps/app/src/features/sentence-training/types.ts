export type ExpressionContextType =
  | "verb"
  | "noun"
  | "adjective"
  | "adverb"
  | "phrasal_verb"
  | "irregular_verb"
  | "simple_expression";

export type ExpressionContext = {
  expressionContextId: string;
  expressionId: string;
  phrase: string;
  translation: string;
  type: ExpressionContextType;
};

export type ValidateSentenceResponse = {
  score: number;
  answer: string;
};
