export class BoxView {
  constructor(
    public readonly boxId: string,
    public readonly title: string,
    public readonly expressionContextIds: string[],
  ) {}
}
