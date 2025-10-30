import { IsUUID, validateSync } from 'class-validator';
import { randomUUID } from 'node:crypto';

export class RepetitionId {
  @IsUUID()
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length) {
      throw new Error('RepetitionId is not valid');
    }
  }

  static create(): RepetitionId {
    return new RepetitionId(randomUUID());
  }

  static fromString(value: string): RepetitionId {
    return new RepetitionId(value);
  }

  equals(other: RepetitionId) {
    return this.value === other.value;
  }
}
