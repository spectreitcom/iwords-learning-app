import { IsUUID, validateSync } from 'class-validator';
import { randomUUID } from 'node:crypto';

export class ExpressionId {
  @IsUUID()
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length) {
      throw new Error('ExpressionId is not valid');
    }
  }

  static create(): ExpressionId {
    return new ExpressionId(randomUUID());
  }

  static fromString(value: string): ExpressionId {
    return new ExpressionId(value);
  }

  equals(expressionId: ExpressionId) {
    return this.value === expressionId.value;
  }
}
