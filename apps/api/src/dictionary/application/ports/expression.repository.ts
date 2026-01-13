import { Expression } from '../../domain/expression';
import { PrismaTx } from '../../../common/types';

export abstract class ExpressionRepository {
  abstract save(expression: Expression, tx?: PrismaTx): Promise<void>;
  abstract findById(id: string, tx?: PrismaTx): Promise<Expression | null>;
  abstract delete(expressionId: string, tx?: PrismaTx): Promise<void>;
}
