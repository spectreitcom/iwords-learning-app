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
  | "irregular_verb"
  | "simple_expression";

export type ExpressionContext = {
  expressionContextId: string;
  expressionId: string;
  translation: string;
  type: ExpressionContextType;
};

export type CreateExpressionContextResponse = {
  id: string;
};

export type Sentence = {
  sentenceId: string;
  translation: string;
  content: string;
};

export type ExpressionContextDetails = ExpressionContext & {
  isCountable: false;
  isIrregular: false;
  forms: [];
  sentences: Sentence[];
  definition: string | null;
  definitionTranslation: string | null;
};

export type SearchedDictionaryExpression = {
  id: string;
  phrase: string;
  translation: string;
  expressionContextId: string;
  expressionId: string;
  type: ExpressionContextType;
  forms: string[];
  isCountable: boolean;
  isIrregular: boolean;
};

export type GenerateExpressionContextDefinitionResponse = {
  definition: string;
  translation: string;
};
