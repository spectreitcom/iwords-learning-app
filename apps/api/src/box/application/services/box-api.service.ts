import { Injectable } from '@nestjs/common';
import { BoxApi } from '../ports/box.api';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateBoxCommand } from '../commands/create-box.command';
import { BoxView } from '../../view/box.view';
import { GetBoxByIdQuery } from '../queries/get-box-by-id.query';
import { DeleteBoxCommand } from '../commands/delete-box.command';
import { UpdateBoxCommand } from '../commands/update-box.command';
import { GetBoxesListQuery } from '../queries/get-boxes-list.query';
import { GetBoxesListQueryResponse } from '../query-handlers/get-boxes-list.query-handler';
import { AddExpressionContextIdCommand } from '../commands/add-expression-context-id.command';
import { RemoveExpressionContextIdCommand } from '../commands/remove-expression-context-id.command';
import { BeginBoxCommand } from '../commands/begin-box.command';
import { IsBoxStartedQuery } from '../queries/is-box-started.query';
import { GetBoxesNumberQuery } from '../queries/get-boxes-number.query';
import { MarkBoxAsFinishedCommand } from '../commands/mark-box-as-finished.command';
import { BoxIsFinishedView } from '../../view/box-is-finished.view';
import { GetInformationIfBoxIsFinishedByBoxIdsQuery } from '../queries/get-information-if-box-is-finished-by-box-ids.query';
import { GetBoxesByIdsQuery } from '../queries/get-boxes-by-ids.query';
import { BoxIsStartedView } from '../../view/box-is-started.view';
import { GetInformationIfBoxAlreadyStartedByBoxIdsQuery } from '../queries/get-information-if-box-already-started-by-box-ids.query';

@Injectable()
export class BoxApiService implements BoxApi {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createBox(title: string): Promise<void> {
    const command = new CreateBoxCommand(title);
    return await this.commandBus.execute(command);
  }

  async getBoxById(boxId: string): Promise<BoxView> {
    const query = new GetBoxByIdQuery(boxId);
    return await this.queryBus.execute(query);
  }

  async deleteBox(boxId: string): Promise<void> {
    const command = new DeleteBoxCommand(boxId);
    return await this.commandBus.execute(command);
  }

  async updateBox(boxId: string, title: string): Promise<void> {
    const command = new UpdateBoxCommand(boxId, title);
    return await this.commandBus.execute(command);
  }

  async getBoxesList(
    take: number,
    page: number,
  ): Promise<GetBoxesListQueryResponse> {
    const query = new GetBoxesListQuery(take, page);
    return await this.queryBus.execute(query);
  }

  async addExpressionContextId(
    boxId: string,
    expressionContextId: string,
  ): Promise<void> {
    const command = new AddExpressionContextIdCommand(
      boxId,
      expressionContextId,
    );
    return await this.commandBus.execute(command);
  }

  async removeExpressionContextId(
    boxId: string,
    expressionContextId: string,
  ): Promise<void> {
    const command = new RemoveExpressionContextIdCommand(
      boxId,
      expressionContextId,
    );
    return await this.commandBus.execute(command);
  }

  async beginBox(userId: string, boxId: string): Promise<void> {
    const command = new BeginBoxCommand(boxId, userId);
    return await this.commandBus.execute(command);
  }

  async isBoxStarted(userId: string, boxId: string): Promise<boolean> {
    const query = new IsBoxStartedQuery(boxId, userId);
    return await this.queryBus.execute(query);
  }

  async getBoxesNumber(): Promise<number> {
    const query = new GetBoxesNumberQuery();
    return await this.queryBus.execute(query);
  }

  async markBoxAsFinished(boxId: string, userId: string): Promise<void> {
    const command = new MarkBoxAsFinishedCommand(boxId, userId);
    return await this.commandBus.execute(command);
  }

  async getInformationIfBoxIsFinishedByBoxIds(
    boxIds: string[],
  ): Promise<BoxIsFinishedView[]> {
    const query = new GetInformationIfBoxIsFinishedByBoxIdsQuery(boxIds);
    return await this.queryBus.execute(query);
  }

  async getBoxesByIds(boxIds: string[]): Promise<BoxView[]> {
    const query = new GetBoxesByIdsQuery(boxIds);
    return await this.queryBus.execute(query);
  }

  async getInformationIfBoxIsAlreadyStartedByBoxIds(
    userId: string,
    boxIds: string[],
  ): Promise<BoxIsStartedView[]> {
    const query = new GetInformationIfBoxAlreadyStartedByBoxIdsQuery(
      userId,
      boxIds,
    );
    return await this.queryBus.execute(query);
  }
}
