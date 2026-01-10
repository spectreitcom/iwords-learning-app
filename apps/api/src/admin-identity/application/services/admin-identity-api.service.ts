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
import { UnblockAdminUserCommand } from '../commands/unblock-admin-user.command';
import { GetUsersListQueryResponse } from '../query-handlers/get-users-list.query-handler';
import { GetUsersListQuery } from '../queries/get-users-list.query';
import { RequestResetPasswordCommand } from '../commands/request-reset-password.command';
import { ResetPasswordCommand } from '../commands/reset-password.command';
import { InviteUserCommand } from '../commands/invite-user.command';
import { ResendInvitationEmailCommand } from '../commands/resend-invitation-email.command';
import { ValidateResetPasswordTokenQueryResponse } from '../query-handlers/validate-reset-password-token.query-handler';
import { ValidateResetPasswordTokenQuery } from '../queries/validate-reset-password-token.query';

@Injectable()
export class AdminIdentityApiService implements AdminIdentityApi {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
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

  async unblockAdminUser(
    adminUserId: string,
    userToUnblockId: string,
  ): Promise<void> {
    const command = new UnblockAdminUserCommand(adminUserId, userToUnblockId);
    return await this.commandBus.execute(command);
  }

  async getUsersList(
    adminUserId: string,
    take: number,
    page: number,
  ): Promise<GetUsersListQueryResponse> {
    const query = new GetUsersListQuery(adminUserId, page, take);
    return await this.queryBus.execute(query);
  }

  async requestResetPassword(email: string): Promise<void> {
    const command = new RequestResetPasswordCommand(email);
    return await this.commandBus.execute(command);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const command = new ResetPasswordCommand(newPassword, token);
    return await this.commandBus.execute(command);
  }

  async inviteUser(email: string, name: string): Promise<void> {
    const command = new InviteUserCommand(email, name);
    return await this.commandBus.execute(command);
  }

  async resendInvitationEmail(adminUserId: string): Promise<void> {
    const command = new ResendInvitationEmailCommand(adminUserId);
    return await this.commandBus.execute(command);
  }

  async validateResetPasswordToken(
    token: string,
  ): Promise<ValidateResetPasswordTokenQueryResponse> {
    const query = new ValidateResetPasswordTokenQuery(token);
    return await this.queryBus.execute(query);
  }
}
