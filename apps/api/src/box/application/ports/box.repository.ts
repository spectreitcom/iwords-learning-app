import { Box } from '../../domain/box';

export abstract class BoxRepository {
  abstract save(box: Box): Promise<void>;
  abstract findById(boxId: string): Promise<Box | null>;
  abstract findByExpressionContextId(
    expressionContextId: string,
  ): Promise<Box[]>;
  abstract findByExpressionContextIds(
    expressionContextIds: string[],
  ): Promise<Box[]>;
  abstract delete(boxId: string): Promise<void>;
}
