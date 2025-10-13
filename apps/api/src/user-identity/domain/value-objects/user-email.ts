import { IsEmail, validateSync } from 'class-validator';

export class UserEmail {
  @IsEmail()
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new Error(`Invalid user email`);
    }
  }

  static fromString(value: string): UserEmail {
    return new UserEmail(value);
  }

  equals(adminUserEmail: UserEmail): boolean {
    return this.value === adminUserEmail.value;
  }
}
