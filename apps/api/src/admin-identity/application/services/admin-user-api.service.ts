import { Injectable } from '@nestjs/common';
import { AdminUserApi } from '../ports/admin-user.api';
import { AdminUserView } from '../../views/admin-user.view';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../queries/get-user-by-id.query';
import { CreateAdminUserCommand } from '../commands/create-admin-user.command';

@Injectable()
export class AdminUserApiService implements AdminUserApi {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  getUserById(adminUserId: string): Promise<AdminUserView> {
    const query = new GetUserByIdQuery(adminUserId);
    return this.queryBus.execute(query);
  }

  createAdminUser(
    email: string,
    password: string,
    name: string,
    isSuperuser: boolean,
  ): Promise<void> {
    const command = new CreateAdminUserCommand(
      email,
      password,
      name,
      isSuperuser,
    );
    return this.commandBus.execute(command);
  }
}
