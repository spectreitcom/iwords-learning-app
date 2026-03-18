import {
  AnswerSentenceReadModel,
  AnswerSentenceReadRepository,
} from '../../../ports/answer-sentence-read.repository';
import { PrismaTx } from '../../../../../common/types';

export abstract class FakeAnswerSentenceReadRepositoryClass extends AnswerSentenceReadRepository {
  abstract getLength(): number;
}

export class FakeAnswerSentenceReadRepository implements FakeAnswerSentenceReadRepositoryClass {
  private readonly data = new Map<string, AnswerSentenceReadModel>();

  constructor(initRecords: AnswerSentenceReadModel[] = []) {
    this.data = new Map(initRecords.map((record) => [record.id, record]));
  }

  async findBySentenceId(
    sentenceId: string,
    _?: any,
  ): Promise<AnswerSentenceReadModel | null> {
    for (const [_, value] of this.data.entries()) {
      if (value.sentenceId === sentenceId) {
        return value;
      }
    }
    return null;
  }

  async findByExpressionContextId(
    expressionContextId: string,
    tx?: PrismaTx,
  ): Promise<AnswerSentenceReadModel[]> {
    const results: AnswerSentenceReadModel[] = [];
    for (const [_, value] of this.data.entries()) {
      if (value.expressionContextId === expressionContextId) {
        results.push(value);
      }
    }
    return results;
  }

  getLength(): number {
    return this.data.size;
  }
}
