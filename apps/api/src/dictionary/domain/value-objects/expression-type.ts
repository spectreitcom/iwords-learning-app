import { IsIn, validateSync } from 'class-validator';
import { ADJECTIVE, ADVERB, NOUN, PHRASAL_VERB, VERB } from '../constants';

export class ExpressionType {
  @IsIn([VERB, NOUN, ADJECTIVE, ADVERB, PHRASAL_VERB])
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length) {
      throw new Error('ExpressionType is not valid');
    }
  }

  static verb() {
    return new ExpressionType(VERB);
  }

  static noun() {
    return new ExpressionType(NOUN);
  }

  static adjective() {
    return new ExpressionType(ADJECTIVE);
  }

  static adverb() {
    return new ExpressionType(ADVERB);
  }

  static phrasalVerb() {
    return new ExpressionType(PHRASAL_VERB);
  }

  static fromString(value: string): ExpressionType {
    return new ExpressionType(value);
  }

  equals(expressionType: ExpressionType) {
    return this.value === expressionType.value;
  }
}
