import { IsUUID, validateSync } from 'class-validator';
import { randomUUID } from 'node:crypto';

export class UserId {
  @IsUUID()
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length) {
      throw new Error('UserId is not valid');
    }
  }

  static create(): UserId {
    return new UserId(randomUUID());
  }

  static fromString(value: string): UserId {
    return new UserId(value);
  }

  equals(adminUserId: UserId) {
    return this.value === adminUserId.value;
  }
}
