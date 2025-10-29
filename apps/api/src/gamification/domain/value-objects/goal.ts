import { IsNumber, IsPositive, validateSync } from 'class-validator';

export class Goal {
  @IsNumber()
  @IsPositive()
  public readonly value: number;

  private constructor(value: number) {
    this.value = value;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length) {
      throw new Error('Goal is not valid');
    }
  }

  static create(value: number): Goal {
    return new Goal(value);
  }

  equals(goal: Goal) {
    return this.value === goal.value;
  }
}
