export class SentenceReadModel {
  constructor(
    public readonly sentenceId: string,
    public readonly content: string,
    public readonly translation: string,
    public readonly expressionContextId: string,
  ) {}
}
