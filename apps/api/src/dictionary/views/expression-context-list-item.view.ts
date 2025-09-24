export class ExpressionContextListItemView {
  constructor(
    public readonly expressionContextId: string,
    public readonly expressionId: string,
    public readonly translation: string,
    public readonly type: string,
  ) {}
}
