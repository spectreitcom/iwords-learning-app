import { ExpressionContext } from '../../domain/expression-context';
import { PrismaTx } from '../../../common/types';

export abstract class ExpressionContextRepository {
  abstract save(
    expressionContext: ExpressionContext,
    tx?: PrismaTx,
  ): Promise<void>;
  abstract findById(
    expressionContextId: string,
  ): Promise<ExpressionContext | null>;
  abstract delete(expressionContextId: string, tx?: PrismaTx): Promise<void>;
  abstract findByIdAndType(
    expressionContextId: string,
    type: string,
  ): Promise<ExpressionContext | null>;
}
