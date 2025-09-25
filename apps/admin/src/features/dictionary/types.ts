export type Expression = {
  expressionId: string;
  phrase: string;
};

export type CreateExpressionResponse = {
  expressionId: string | null;
  existingExpressionId: string | null;
};
