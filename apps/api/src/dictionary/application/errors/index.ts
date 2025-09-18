export class ExpressionNotFoundError extends Error {
  constructor(expressionId: string) {
    super(`Expression with id ${expressionId} not found.`);
  }
}

export class ExpressionPhraseAlreadyTakenError extends Error {
  constructor(phrase: string) {
    super(`Expression with phrase ${phrase} already exists.`);
  }
}
