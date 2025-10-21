import { Injectable } from '@nestjs/common';
import { UserApi } from '../ports/user.api';
import { GetUsersListQueryResponse } from '../query-handlers/get-users-list.query-handler';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUsersListQuery } from '../queries/get-users-list.query';
import { BlockUserCommand } from '../commands/block-user.command';
import { UnblockUserCommand } from '../commands/unblock-user.command';
import { UserView } from '../../views/user.view';
import { GetUserByClerkIdQuery } from '../queries/get-user-by-clerk-id.query';
import { GetUserByIdQuery } from '../queries/get-user-by-id.query';

@Injectable()
export class UserApiService implements UserApi {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async getUsersList(
    take: number,
    page: number,
  ): Promise<GetUsersListQueryResponse> {
    const query = new GetUsersListQuery(take, page);
    return await this.queryBus.execute(query);
  }

  async blockUser(userId: string): Promise<void> {
    const command = new BlockUserCommand(userId);
    return await this.commandBus.execute(command);
  }

  async unblockUser(userId: string): Promise<void> {
    const command = new UnblockUserCommand(userId);
    return await this.commandBus.execute(command);
  }

  async getUserByClerkId(clerkId: string): Promise<UserView | null> {
    const query = new GetUserByClerkIdQuery(clerkId);
    return await this.queryBus.execute(query);
  }

  async getUserById(userId: string): Promise<UserView> {
    const query = new GetUserByIdQuery(userId);
    return await this.queryBus.execute(query);
  }
}
