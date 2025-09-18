import { Expression } from '../../domain/expression';

export abstract class ExpressionRepository {
  abstract save(expression: Expression): Promise<void>;
  abstract findById(id: string): Promise<Expression | null>;
}
