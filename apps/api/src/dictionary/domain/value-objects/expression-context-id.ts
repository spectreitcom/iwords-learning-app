import { IsUUID, validateSync } from 'class-validator';
import { randomUUID } from 'node:crypto';

export class ExpressionContextId {
  @IsUUID()
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length) {
      throw new Error('ExpressionContextId is not valid');
    }
  }

  static create(): ExpressionContextId {
    return new ExpressionContextId(randomUUID());
  }

  static fromString(value: string): ExpressionContextId {
    return new ExpressionContextId(value);
  }

  equals(expressionContextId: ExpressionContextId) {
    return this.value === expressionContextId.value;
  }
}
