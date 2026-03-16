import { MaxLength, MinLength, validateSync } from 'class-validator';

export class NoteTitle {
  @MinLength(3)
  @MaxLength(120)
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length) {
      throw new Error('NoteTitle is not valid');
    }
  }

  static fromString(value: string): NoteTitle {
    return new NoteTitle(value);
  }

  equals(other: NoteTitle) {
    return this.value === other.value;
  }
}
