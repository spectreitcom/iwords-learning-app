import { IsUUID, validateSync } from 'class-validator';

export class NoteExpressionContextId {
  @IsUUID()
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length) {
      throw new Error('NoteExpressionContextId is not valid');
    }
  }

  static fromString(value: string): NoteExpressionContextId {
    return new NoteExpressionContextId(value);
  }

  equals(other: NoteExpressionContextId) {
    return this.value === other.value;
  }
}
