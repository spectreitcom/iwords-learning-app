import { Injectable } from '@nestjs/common';
import { BoxRepetitionApi } from '../ports/box-repetition.api';
import { QueryBus } from '@nestjs/cqrs';
import { GetBoxIdsForCurrentRepetitionQuery } from '../queries/get-box-ids-for-current-repetition.query';
import { BoxRepetitionUserView } from '../../views/box-repetition-user.view';
import { GetBoxesRepetitionDataQuery } from '../queries/get-boxes-repetition-data.query';

@Injectable()
class BoxRepetitionApiService implements BoxRepetitionApi {
  constructor(private readonly queryBus: QueryBus) {}

  async getBoxIdsForCurrentRepetition(userId: string): Promise<string[]> {
    const query = new GetBoxIdsForCurrentRepetitionQuery(userId);
    return await this.queryBus.execute(query);
  }

  async getBoxesRepetitionData(
    userId: string,
    boxIds: string[],
  ): Promise<BoxRepetitionUserView[]> {
    const query = new GetBoxesRepetitionDataQuery(userId, boxIds);
    return await this.queryBus.execute(query);
  }
}

export default BoxRepetitionApiService;
