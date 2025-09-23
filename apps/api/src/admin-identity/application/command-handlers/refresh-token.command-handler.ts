import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenCommand } from '../commands/refresh-token.command';
import { AdminUserView } from '../../views/admin-user.view';
import { RefreshTokenService } from '../ports/refresh-token.service';
import { AccessTokenService } from '../ports/access-token.service';
import {
  AdminIdentityNotFoundError,
  InvalidRefreshTokenError,
} from '../errors';
import { AdminUserRepository } from '../ports/admin-user.repository';
import { randomUUID } from 'node:crypto';
import { RefreshTokenStorage } from '../ports/refresh-token.storage';

export type RefreshTokenCommandResponse = {
  accessToken: string;
  refreshToken: string;
  user: AdminUserView;
};

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler
  implements ICommandHandler<RefreshTokenCommand, RefreshTokenCommandResponse>
{
  constructor(
    private readonly refreshTokenService: RefreshTokenService,
    private readonly accessTokenService: AccessTokenService,
    private readonly adminUserRepository: AdminUserRepository,
    private readonly refreshTokenStorage: RefreshTokenStorage,
  ) {}

  async execute(
    command: RefreshTokenCommand,
  ): Promise<RefreshTokenCommandResponse> {
    const result = this.refreshTokenService.verifyToken(command.refreshToken);

    if (!result) throw new InvalidRefreshTokenError();

    const isValid = await this.refreshTokenStorage.validate(
      result.sub,
      result.refreshTokenId,
    );

    if (!isValid) throw new InvalidRefreshTokenError();

    const adminUser = await this.adminUserRepository.findById(result.sub);

    if (!adminUser) throw new AdminIdentityNotFoundError(result.sub);

    const accessToken = this.accessTokenService.createToken(result.sub);

    const refreshTokenId = randomUUID();

    const refreshToken = this.refreshTokenService.createToken(
      result.sub,
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
      ),
    };
  }
}
