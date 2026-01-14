import { IsUUID, validateSync } from 'class-validator';
import { randomUUID } from 'node:crypto';

export class DailyLearnedBoxId {
  @IsUUID()
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length) {
      throw new Error('DailyLearnedBoxId is not valid');
    }
  }

  static create(): DailyLearnedBoxId {
    return new DailyLearnedBoxId(randomUUID());
  }

  static fromString(value: string): DailyLearnedBoxId {
    return new DailyLearnedBoxId(value);
  }

  equals(boxId: DailyLearnedBoxId) {
    return this.value === boxId.value;
  }
}
