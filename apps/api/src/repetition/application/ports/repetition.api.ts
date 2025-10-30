export abstract class RepetitionApi {
  abstract getUserRepetitions(userId: string): Promise<string[]>;
}
