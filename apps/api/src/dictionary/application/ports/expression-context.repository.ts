import { ExpressionContext } from '../../domain/expression-context';
import { PrismaTx } from '../../../common/types';

export abstract class ExpressionContextRepository {
  abstract save(
    expressionContext: ExpressionContext,
    tx?: PrismaTx,
  ): Promise<void>;

  abstract findById(
    expressionContextId: string,
    tx?: PrismaTx,
  ): Promise<ExpressionContext | null>;

  abstract delete(expressionContextId: string, tx?: PrismaTx): Promise<void>;

  abstract findByIdAndType(
    expressionContextId: string,
    type: string,
    tx?: PrismaTx,
  ): Promise<ExpressionContext | null>;

  abstract findByExpressionId(
    expressionId: string,
    tx?: PrismaTx,
  ): Promise<ExpressionContext[]>;
}
