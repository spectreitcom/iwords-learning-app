import { IsUUID, validateSync } from 'class-validator';
import { randomUUID } from 'node:crypto';

export class NoteId {
  @IsUUID()
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length) {
      throw new Error('NoteId is not valid');
    }
  }

  static create(): NoteId {
    return new NoteId(randomUUID());
  }

  static fromString(value: string): NoteId {
    return new NoteId(value);
  }

  equals(other: NoteId) {
    return this.value === other.value;
  }
}
