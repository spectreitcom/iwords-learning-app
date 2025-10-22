import { BoxView } from '../../view/box.view';
import { GetBoxesListQueryResponse } from '../query-handlers/get-boxes-list.query-handler';

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
}
