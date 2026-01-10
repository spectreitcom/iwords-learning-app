import { IsDate, validateSync } from 'class-validator';

export class NextRepetitionDate {
  @IsDate()
  public readonly value: Date;

  private constructor(value: Date) {
    this.value = value;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    const now = new Date();
    if (
      errors.length ||
      Number.isNaN(this.value.getTime()) ||
      this.value.getTime() <= now.getTime()
    ) {
      throw new Error('NextRepetitionDate is not valid');
    }
  }

  static create(value: Date): NextRepetitionDate {
    return new NextRepetitionDate(value);
  }

  equals(other: NextRepetitionDate) {
    return this.value.getTime() === other.value.getTime();
  }
}
