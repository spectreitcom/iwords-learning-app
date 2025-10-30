import { Injectable } from '@nestjs/common';
import { RepetitionApi } from '../ports/repetition.api';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserRepetitionsQuery } from '../queries/get-user-repetitions.query';

@Injectable()
export class RepetitionApiService implements RepetitionApi {
  constructor(private readonly queryBus: QueryBus) {}

  async getUserRepetitions(userId: string): Promise<string[]> {
    const query = new GetUserRepetitionsQuery(userId);
    return await this.queryBus.execute(query);
  }
}
