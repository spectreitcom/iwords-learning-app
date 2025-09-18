export class ExpressionNotFoundError extends Error {
  constructor(expressionId: string) {
    super(`Expression with id ${expressionId} not found.`);
  }
}
