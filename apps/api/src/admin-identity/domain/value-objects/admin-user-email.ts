import { IsEmail, validateSync } from 'class-validator';

export class AdminUserEmail {
  @IsEmail()
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw new Error(`Invalid admin user email`);
    }
  }

  static fromString(value: string): AdminUserEmail {
    return new AdminUserEmail(value);
  }

  equals(adminUserEmail: AdminUserEmail): boolean {
    return this.value === adminUserEmail.value;
  }
}
