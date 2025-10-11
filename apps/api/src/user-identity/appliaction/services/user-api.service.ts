import { Injectable } from '@nestjs/common';
import { UserApi } from '../ports/user.api';
import { GetUsersListQueryResponse } from '../query-handlers/get-users-list.query-handler';
import { QueryBus } from '@nestjs/cqrs';
import { GetUsersListQuery } from '../queries/get-users-list.query';

@Injectable()
export class UserApiService implements UserApi {
  constructor(private readonly queryBus: QueryBus) {}

  async getUsersList(
    take: number,
    page: number,
  ): Promise<GetUsersListQueryResponse> {
    const query = new GetUsersListQuery(take, page);
    return await this.queryBus.execute(query);
  }
}
