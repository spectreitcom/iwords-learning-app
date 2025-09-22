import { IsUUID, validateSync } from 'class-validator';
import { randomUUID } from 'node:crypto';

export class AdminUserId {
  @IsUUID()
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length) {
      throw new Error('AdminUserId is not valid');
    }
  }

  static create(): AdminUserId {
    return new AdminUserId(randomUUID());
  }

  static fromString(value: string): AdminUserId {
    return new AdminUserId(value);
  }

  equals(adminUserId: AdminUserId) {
    return this.value === adminUserId.value;
  }
}
