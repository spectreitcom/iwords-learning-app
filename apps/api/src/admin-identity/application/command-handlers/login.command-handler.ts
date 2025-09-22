import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../commands/login.command';
import { AdminUserView } from '../../views/admin-user.view';
import { AdminUserRepository } from '../ports/admin-user.repository';
import { WrongEmailOrPasswordError } from '../errors';
import { AccessTokenService } from '../ports/access-token.service';

export type LoginCommandResponse = {
  accessToken: string;
  user: AdminUserView;
};

@CommandHandler(LoginCommand)
export class LoginCommandHandler
  implements ICommandHandler<LoginCommand, LoginCommandResponse>
{
  constructor(
    private readonly adminUserRepository: AdminUserRepository,
    private readonly accessTokenService: AccessTokenService,
  ) {}

  async execute(command: LoginCommand): Promise<LoginCommandResponse> {
    const { userId } = command;
    const adminUser = await this.adminUserRepository.findById(userId);

    if (!adminUser) throw new WrongEmailOrPasswordError();

    const accessToken = this.accessTokenService.createToken(
      adminUser.getAdminUserId().value,
    );

    return {
      accessToken,
      user: new AdminUserView(
        adminUser.getAdminUserId().value,
        adminUser.getEmail().value,
        adminUser.getName(),
      ),
    };
  }
}
