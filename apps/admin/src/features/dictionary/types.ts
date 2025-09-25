export type Expression = {
  expressionId: string;
  phrase: string;
};

export type CreateExpressionResponse = {
  expressionId: string | null;
  existingExpressionId: string | null;
};

export type ExpressionContextType =
  | "verb"
  | "noun"
  | "adjective"
  | "adverb"
  | "phrasal_verb"
  | "irregular_verb";

export type ExpressionContext = {
  expressionContextId: string;
  expressionId: string;
  translation: string;
  type: ExpressionContextType;
};
