import { Repetition } from '../../domain/repetition';

export abstract class RepetitionRepository {
  abstract save(repetition: Repetition): Promise<void>;
  abstract findByUser(userId: string): Promise<Repetition[]>;
  abstract deleteAllForUser(userId: string): Promise<void>;
  abstract deleteOne(
    userId: string,
    expressionContextId: string,
  ): Promise<void>;
}
