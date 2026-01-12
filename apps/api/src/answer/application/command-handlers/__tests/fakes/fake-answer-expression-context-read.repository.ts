import {
  AnswerExpressionContextReadModel,
  AnswerExpressionContextReadRepository,
} from '../../../ports/answer-expression-context-read.repository';

export abstract class FakeAnswerExpressionContextReadRepositoryClass extends AnswerExpressionContextReadRepository {
  abstract getLength(): number;
}

export class FakeAnswerExpressionContextReadRepository
  implements FakeAnswerExpressionContextReadRepositoryClass
{
  private readonly data = new Map<string, AnswerExpressionContextReadModel>();

  constructor(data: AnswerExpressionContextReadModel[] = []) {
    this.data = new Map(data.map((record) => [record.id, record]));
  }

  async findByExpressionContextId(
    expressionContextId: string,
    _?: any,
  ): Promise<AnswerExpressionContextReadModel | null> {
    for (const [_, value] of this.data.entries()) {
      if (value.expressionContextId === expressionContextId) {
        return value;
      }
    }
    return null;
  }

  getLength(): number {
    return this.data.size;
  }
}
