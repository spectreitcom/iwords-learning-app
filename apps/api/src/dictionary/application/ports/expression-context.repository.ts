import { ExpressionContext } from '../../domain/expression-context';

export abstract class ExpressionContextRepository {
  abstract save(expressionContext: ExpressionContext): Promise<void>;
  abstract findById(
    expressionContextId: string,
  ): Promise<ExpressionContext | null>;
  abstract delete(expressionContextId: string): Promise<void>;
}
