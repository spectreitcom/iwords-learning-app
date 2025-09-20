export class DictionaryReadModel {
  constructor(
    public readonly id: string,
    public readonly phrase: string,
    public readonly translation: string,
    public readonly expressionContextId: string,
    public readonly expressionId: string,
    public readonly type: string,
    public readonly forms: [string, string, string] | null,
    public readonly isCountable: boolean,
    public readonly isIrregular: boolean,
  ) {}
}
