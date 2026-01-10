import { BoxRepetitionUserView } from '../../views/box-repetition-user.view';

export abstract class BoxRepetitionApi {
  abstract getBoxIdsForCurrentRepetition(userId: string): Promise<string[]>;
  abstract getBoxesRepetitionData(
    userId: string,
    boxIds: string[],
  ): Promise<BoxRepetitionUserView[]>;
}
