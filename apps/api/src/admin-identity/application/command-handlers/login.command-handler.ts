import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../commands/login.command';
import { AdminUserView } from '../../views/admin-user.view';
import { AdminUserRepository } from '../ports/admin-user.repository';
import { AccessTokenService } from '../ports/access-token.service';
import { RefreshTokenService } from '../ports/refresh-token.service';
import { RefreshTokenStorage } from '../ports/refresh-token.storage';
import { randomUUID } from 'node:crypto';
import { AppError } from '../../../common/errors';

export type LoginCommandResponse = {
  accessToken: string;
  refreshToken: string;
  user: AdminUserView;
};

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<
  LoginCommand,
  LoginCommandResponse
> {
  constructor(
    private readonly adminUserRepository: AdminUserRepository,
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly refreshTokenStorage: RefreshTokenStorage,
  ) {}

  async execute(command: LoginCommand): Promise<LoginCommandResponse> {
    const { userId } = command;
    const adminUser = await this.adminUserRepository.findById(userId);

    if (!adminUser || adminUser.getBlocked())
      throw new AppError('WRONG_CREDENTIALS', 'Wrong credentials');

    const accessToken = this.accessTokenService.createToken(
      adminUser.getAdminUserId().value,
    );

    const refreshTokenId = randomUUID();

    const refreshToken = this.refreshTokenService.createToken(
      adminUser.getAdminUserId().value,
      refreshTokenId,
    );

    await this.refreshTokenStorage.insert(
      adminUser.getAdminUserId().value,
      refreshTokenId,
    );

    return {
      accessToken,
      refreshToken,
      user: new AdminUserView(
        adminUser.getAdminUserId().value,
        adminUser.getEmail().value,
        adminUser.getName(),
        adminUser.getBlocked(),
      ),
    };
  }
}
