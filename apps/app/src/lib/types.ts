export type CollectionWithPagination<T> = {
  data: T[];
  total: number;
  currentPage: number;
};

export type ExpressionContextType =
  | "verb"
  | "noun"
  | "adjective"
  | "adverb"
  | "phrasal_verb"
  | "irregular_verb"
  | "simple_expression";
