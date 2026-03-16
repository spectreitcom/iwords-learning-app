import { IsUUID, validateSync } from 'class-validator';

export class NoteUserId {
  @IsUUID()
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length) {
      throw new Error('NoteUserId is not valid');
    }
  }

  static fromString(value: string): NoteUserId {
    return new NoteUserId(value);
  }

  equals(other: NoteUserId) {
    return this.value === other.value;
  }
}
