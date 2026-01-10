import { BoxView } from '../../view/box.view';
import { GetBoxesListQueryResponse } from '../query-handlers/get-boxes-list.query-handler';
import { BoxIsFinishedView } from '../../view/box-is-finished.view';
import { BoxIsStartedView } from '../../view/box-is-started.view';

export abstract class BoxApi {
  abstract createBox(title: string): Promise<void>;

  abstract getBoxById(boxId: string): Promise<BoxView>;

  abstract deleteBox(boxId: string): Promise<void>;

  abstract updateBox(boxId: string, title: string): Promise<void>;

  abstract getBoxesList(
    take: number,
    page: number,
  ): Promise<GetBoxesListQueryResponse>;

  abstract removeExpressionContextId(
    boxId: string,
    expressionContextId: string,
  ): Promise<void>;

  abstract addExpressionContextId(
    boxId: string,
    expressionContextId: string,
  ): Promise<void>;

  abstract beginBox(userId: string, boxId: string): Promise<void>;

  abstract isBoxStarted(userId: string, boxId: string): Promise<boolean>;

  abstract getBoxesNumber(): Promise<number>;

  abstract markBoxAsFinished(boxId: string, userId: string): Promise<void>;

  abstract getInformationIfBoxIsFinishedByBoxIds(
    boxIds: string[],
  ): Promise<BoxIsFinishedView[]>;

  abstract getBoxesByIds(boxIds: string[]): Promise<BoxView[]>;

  abstract getInformationIfBoxIsAlreadyStartedByBoxIds(
    userId: string,
    boxIds: string[],
  ): Promise<BoxIsStartedView[]>;
}
