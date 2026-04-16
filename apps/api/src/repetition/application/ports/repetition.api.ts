import { RepetitionView } from '../../views/repetition.view';

export abstract class RepetitionApi {
  abstract getUserRepetitions(userId: string): Promise<RepetitionView[]>;
  abstract deleteAllUserRepetitions(userId: string): Promise<void>;
  abstract deleteOneUserRepetition(
    userId: string,
    repetitionId: string,
  ): Promise<void>;
  abstract addExpressionContextToRepetition(
    expressionContextId: string,
    userId: string,
  ): Promise<void>;
}
