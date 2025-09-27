export class ExpressionContextIdAlreadyExists extends Error {
  constructor(expressionContextId: string) {
    super(`ExpressionContextIdAlreadyExists: ${expressionContextId}`);
  }
}
