import { PrismaTx } from '../../../common/types';

export class AnswerExpressionContextReadModel {
  constructor(
    public readonly id: string,
    public readonly phrase: string,
    public readonly expressionId: string,
    public readonly expressionContextId: string,
    public readonly type: string,
    public readonly translation: string,
    public readonly forms: string[],
    public readonly isIrregular: boolean,
    public readonly isCountable: boolean,
    public readonly sentenceIds: string[],
  ) {}
}

export abstract class AnswerExpressionContextReadRepository {
  abstract findByExpressionContextId(
    expressionContextId: string,
    tx?: PrismaTx,
  ): Promise<AnswerExpressionContextReadModel | null>;
}
