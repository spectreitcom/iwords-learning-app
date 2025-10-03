import { Injectable } from '@nestjs/common';
import { AdminIdentityApi } from '../ports/admin-identity.api';
import { AdminUserView } from '../../views/admin-user.view';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../queries/get-user-by-id.query';
import { CreateAdminUserCommand } from '../commands/create-admin-user.command';
import { LoginCommandResponse } from '../command-handlers/login.command-handler';
import { LoginCommand } from '../commands/login.command';
import { ValidateUserQuery } from '../queries/validate-user.query';
import { RefreshTokenCommandResponse } from '../command-handlers/refresh-token.command-handler';
import { RefreshTokenCommand } from '../commands/refresh-token.command';
import { SignOutCommand } from '../commands/sign-out.command';
import { ChangePasswordCommand } from '../commands/change-password.command';
import { BlockAdminUserCommand } from '../commands/block-admin-user.command';

@Injectable()
export class AdminIdentityApiService implements AdminIdentityApi {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  async getUserById(adminUserId: string): Promise<AdminUserView> {
    const query = new GetUserByIdQuery(adminUserId);
    return await this.queryBus.execute(query);
  }

  async createAdminUser(
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
    return await this.commandBus.execute(command);
  }

  async signIn(userId: string): Promise<LoginCommandResponse> {
    const command = new LoginCommand(userId);
    return await this.commandBus.execute(command);
  }

  async validateUser(email: string, password: string): Promise<AdminUserView> {
    const query = new ValidateUserQuery(email, password);
    return await this.queryBus.execute(query);
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<RefreshTokenCommandResponse> {
    const command = new RefreshTokenCommand(refreshToken);
    return await this.commandBus.execute(command);
  }

  async signOut(userId: string): Promise<void> {
    const command = new SignOutCommand(userId);
    return await this.commandBus.execute(command);
  }

  async changeLoggedUserPassword(
    userId: string,
    existingPassword: string,
    newPassword: string,
  ): Promise<void> {
    const command = new ChangePasswordCommand(
      existingPassword,
      newPassword,
      userId,
    );
    return await this.commandBus.execute(command);
  }

  async blockAdminUser(
    adminUserId: string,
    userToBlockId: string,
  ): Promise<void> {
    const command = new BlockAdminUserCommand(adminUserId, userToBlockId);
    return await this.commandBus.execute(command);
  }
}
