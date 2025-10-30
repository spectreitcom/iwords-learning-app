import { Repetition } from '../../domain/repetition';

export abstract class RepetitionRepository {
  abstract save(repetition: Repetition): Promise<void>;
  abstract findByUser(userId: string): Promise<Repetition[]>;
}
