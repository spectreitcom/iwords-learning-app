import { Injectable } from '@nestjs/common';
import { BoxApi } from '../ports/box.api';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateBoxCommand } from '../commands/create-box.command';
import { BoxView } from '../../view/box.view';
import { GetBoxByIdQuery } from '../queries/get-box-by-id.query';
import { DeleteBoxCommand } from '../commands/delete-box.command';
import { UpdateBoxCommand } from '../commands/update-box.command';

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
}
