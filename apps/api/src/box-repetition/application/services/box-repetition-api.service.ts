import { Injectable } from '@nestjs/common';
import { BoxRepetitionApi } from '../ports/box-repetition.api';
import { QueryBus } from '@nestjs/cqrs';
import { GetBoxIdsForCurrentRepetitionQuery } from '../queries/get-box-ids-for-current-repetition.query';

@Injectable()
export class BoxRepetitionApiService implements BoxRepetitionApi {
  constructor(private readonly queryBus: QueryBus) {}

  async getBoxIdsForCurrentRepetition(userId: string): Promise<string[]> {
    const query = new GetBoxIdsForCurrentRepetitionQuery(userId);
    return this.queryBus.execute(query);
  }
}
