import { IsUUID, validateSync } from 'class-validator';
import { randomUUID } from 'node:crypto';

export class UserDailyGoalId {
  @IsUUID()
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length) {
      throw new Error('UserDailyGoalId is not valid');
    }
  }

  static create(): UserDailyGoalId {
    return new UserDailyGoalId(randomUUID());
  }

  static fromString(value: string): UserDailyGoalId {
    return new UserDailyGoalId(value);
  }

  equals(userDailyGoalId: UserDailyGoalId) {
    return this.value === userDailyGoalId.value;
  }
}
