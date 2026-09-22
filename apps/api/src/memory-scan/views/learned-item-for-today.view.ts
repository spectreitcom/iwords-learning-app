export class LearnedItemForTodayView {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly expressionContextId: string,
    public readonly expressionId: string,
    public readonly createdAt: Date,
  ) {}
}
