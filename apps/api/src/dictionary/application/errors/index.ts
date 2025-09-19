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

export class ExpressionContextNotFoundError extends Error {
  constructor(expressionContextId: string) {
    super(`Expression context with id ${expressionContextId} not found.`);
  }
}

export class SentenceNotFoundError extends Error {
  constructor(sentenceId: string) {
    super(`Sentence with id ${sentenceId} not found.`);
  }
}
