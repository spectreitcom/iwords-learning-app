import { GetUsersListQueryResponse } from '../query-handlers/get-users-list.query-handler';
import { UserView } from '../../views/user.view';

export abstract class UserApi {
  abstract getUsersList(
    take: number,
    page: number,
  ): Promise<GetUsersListQueryResponse>;

  abstract blockUser(userId: string): Promise<void>;

  abstract unblockUser(userId: string): Promise<void>;

  abstract getUserByClerkId(clerkId: string): Promise<UserView | null>;

  abstract getUserById(userId: string): Promise<UserView>;

  abstract getUsersNumber(): Promise<number>;
}
