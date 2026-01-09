export abstract class BoxRepetitionApi {
  abstract getBoxIdsForCurrentRepetition(userId: string): Promise<string[]>;
}
