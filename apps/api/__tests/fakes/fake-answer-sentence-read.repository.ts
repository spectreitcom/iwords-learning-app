import {
  AnswerSentenceReadModel,
  AnswerSentenceReadRepository,
} from '../../src/answer/application/ports/answer-sentence-read.repository';

export abstract class FakeAnswerSentenceReadRepositoryClass extends AnswerSentenceReadRepository {
  abstract getLength(): number;
}

export class FakeAnswerSentenceReadRepository
  implements FakeAnswerSentenceReadRepositoryClass
{
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

  getLength(): number {
    return this.data.size;
  }
}
