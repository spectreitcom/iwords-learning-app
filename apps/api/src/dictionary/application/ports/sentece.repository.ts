import { Sentence } from '../../domain/sentence';

export abstract class SentenceRepository {
  abstract save(sentence: Sentence): Promise<void>;
  abstract findById(sentenceId: string): Promise<Sentence | null>;
  abstract delete(sentenceId: string): Promise<void>;
}
