import { Injectable } from '@nestjs/common';
import { RepetitionApi } from '../ports/repetition.api';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserRepetitionsQuery } from '../queries/get-user-repetitions.query';
import { DeleteAllUserRepetitionsCommand } from '../commands/delete-all-user-repetitions.command';

@Injectable()
export class RepetitionApiService implements RepetitionApi {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async getUserRepetitions(userId: string): Promise<string[]> {
    const query = new GetUserRepetitionsQuery(userId);
    return await this.queryBus.execute(query);
  }

  async deleteAllUserRepetitions(userId: string): Promise<void> {
    const command = new DeleteAllUserRepetitionsCommand(userId);
    return await this.commandBus.execute(command);
  }
}
