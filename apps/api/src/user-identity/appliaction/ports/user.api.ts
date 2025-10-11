import { GetUsersListQueryResponse } from '../query-handlers/get-users-list.query-handler';

export abstract class UserApi {
  abstract getUsersList(
    take: number,
    page: number,
  ): Promise<GetUsersListQueryResponse>;
}
