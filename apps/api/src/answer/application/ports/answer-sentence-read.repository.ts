import { PrismaTx } from '../../../common/types';

export class AnswerSentenceReadModel {
  constructor(
    public readonly id: string,
    public readonly sentenceId: string,
    public readonly content: string,
    public readonly translation: string,
    public readonly expressionContextId: string,
    public readonly expressionId: string,
  ) {}
}

export abstract class AnswerSentenceReadRepository {
  abstract findBySentenceId(
    sentenceId: string,
    tx?: PrismaTx,
  ): Promise<AnswerSentenceReadModel | null>;

  abstract findByExpressionContextId(
    expressionContextId: string,
    tx?: PrismaTx,
  ): Promise<AnswerSentenceReadModel[]>;
}
