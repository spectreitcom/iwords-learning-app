import { Sentence } from '../../domain/sentence';
import { PrismaTx } from '../../../common/types';

export abstract class SentenceRepository {
  abstract save(sentence: Sentence, tx?: PrismaTx): Promise<void>;
  abstract findById(sentenceId: string): Promise<Sentence | null>;
  abstract delete(sentenceId: string, tx?: PrismaTx): Promise<void>;
}
