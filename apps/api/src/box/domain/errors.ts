export class ExpressionContextIdAlreadyExists extends Error {
  constructor(expressionContextId: string) {
    super(`ExpressionContextIdAlreadyExists: ${expressionContextId}`);
  }
}

export class ExpressionContextsQuantityExceeded extends Error {
  constructor(boxId: string) {
    super(`ExpressionContextsAmountExeeded: ${boxId}`);
  }
}
