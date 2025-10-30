import { IsUUID, validateSync } from 'class-validator';

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

  static fromString(value: string): UserId {
    return new UserId(value);
  }

  equals(userId: UserId) {
    return this.value === userId.value;
  }
}
