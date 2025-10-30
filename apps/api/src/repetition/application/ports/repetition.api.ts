export abstract class RepetitionApi {
  abstract getUserRepetitions(userId: string): Promise<string[]>;
  abstract deleteAllUserRepetitions(userId: string): Promise<void>;
}
