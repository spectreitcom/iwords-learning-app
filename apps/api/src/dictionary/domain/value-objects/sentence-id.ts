import { IsUUID, validateSync } from 'class-validator';
import { randomUUID } from 'node:crypto';

export class SentenceId {
  @IsUUID()
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length) {
      throw new Error('SentenceId is not valid');
    }
  }

  static create(): SentenceId {
    return new SentenceId(randomUUID());
  }

  static fromString(value: string): SentenceId {
    return new SentenceId(value);
  }

  equals(sentenceId: SentenceId) {
    return this.value === sentenceId.value;
  }
}
