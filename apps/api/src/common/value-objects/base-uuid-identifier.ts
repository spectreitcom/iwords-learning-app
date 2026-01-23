import { IsUUID, validateSync } from 'class-validator';
import { randomUUID } from 'node:crypto';

export class BaseUuidIdentifier {
  protected objectName = 'BaseUuidIdentifier';

  @IsUUID()
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length) {
      throw new Error(`${this.objectName} is not valid`);
    }
  }

  static create(): BaseUuidIdentifier {
    return new BaseUuidIdentifier(randomUUID());
  }

  static fromString(value: string): BaseUuidIdentifier {
    return new BaseUuidIdentifier(value);
  }

  equals(expressionId: BaseUuidIdentifier) {
    return this.value === expressionId.value;
  }
}
