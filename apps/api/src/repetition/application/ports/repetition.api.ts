export abstract class RepetitionApi {
  abstract getUserRepetitions(userId: string): Promise<string[]>;
  abstract deleteAllUserRepetitions(userId: string): Promise<void>;
  abstract deleteOneUserRepetition(
    userId: string,
    repetitionId: string,
  ): Promise<void>;
}
