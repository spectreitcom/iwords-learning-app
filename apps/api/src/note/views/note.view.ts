export class NoteView {
  constructor(
    public readonly id: string,
    public readonly expressionContextId: string,
    public readonly userId: string,
    public readonly title: string,
    public readonly content: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
