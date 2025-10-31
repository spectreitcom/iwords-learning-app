import { Injectable } from '@nestjs/common';
import { RepetitionApi } from '../ports/repetition.api';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserRepetitionsQuery } from '../queries/get-user-repetitions.query';
import { DeleteAllUserRepetitionsCommand } from '../commands/delete-all-user-repetitions.command';
import { DeleteOneUserRepetitionCommand } from '../commands/delete-one-user-repetition.command';
import { RepetitionView } from '../../views/repetition.view';

@Injectable()
export class RepetitionApiService implements RepetitionApi {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async getUserRepetitions(userId: string): Promise<RepetitionView[]> {
    const query = new GetUserRepetitionsQuery(userId);
    return await this.queryBus.execute(query);
  }

  async deleteAllUserRepetitions(userId: string): Promise<void> {
    const command = new DeleteAllUserRepetitionsCommand(userId);
    return await this.commandBus.execute(command);
  }

  async deleteOneUserRepetition(
    userId: string,
    repetitionId: string,
  ): Promise<void> {
    const command = new DeleteOneUserRepetitionCommand(userId, repetitionId);
    return await this.commandBus.execute(command);
  }
}
