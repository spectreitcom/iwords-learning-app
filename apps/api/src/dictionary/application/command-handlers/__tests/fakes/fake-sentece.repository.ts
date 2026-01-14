import { SentenceRepository } from '../../../ports/sentece.repository';
import { Sentence } from '../../../../domain/sentence';
import { SentenceId } from '../../../../domain/value-objects/sentence-id';
import { ExpressionContextId } from '../../../../domain/value-objects/expression-context-id';

type FakeSentenceModel = {
  id: string;
  content: string;
  translation: string;
  expressionContextId: string;
};

export class FakeSentenceRepository implements SentenceRepository {
  private readonly data = new Map<string, FakeSentenceModel>();

  constructor(initialData: FakeSentenceModel[] = []) {
    initialData.forEach((item) => this.data.set(item.id, item));
  }

  async save(sentence: Sentence, tx?: any): Promise<void> {
    this.data.set(sentence.getSentenceId().value, {
      id: sentence.getSentenceId().value,
      content: sentence.getContent(),
      translation: sentence.getTranslation(),
      expressionContextId: sentence.getExpressionContextId().value,
    });
  }

  async findById(sentenceId: string, tx?: any): Promise<Sentence | null> {
    const data = this.data.get(sentenceId);

    if (!data) return null;

    return new Sentence(
      SentenceId.fromString(data.id),
      data.content,
      data.translation,
      ExpressionContextId.fromString(data.expressionContextId),
    );
  }

  async delete(sentenceId: string, tx?: any): Promise<void> {
    this.data.delete(sentenceId);
  }

  getLength(): number {
    return this.data.size;
  }
}
