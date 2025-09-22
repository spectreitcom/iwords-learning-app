import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../commands/login.command';
import { AdminUserView } from '../../views/admin-user.view';
import { HashingService } from '../ports/hashing.service';
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
    private readonly hashingService: HashingService,
    private readonly adminUserRepository: AdminUserRepository,
    private readonly accessTokenService: AccessTokenService,
  ) {}

  async execute(command: LoginCommand): Promise<LoginCommandResponse> {
    const { email, password } = command;

    const adminUser = await this.adminUserRepository.findByEmail(email);

    if (!adminUser) throw new WrongEmailOrPasswordError();

    const isPasswordCorrect = await this.hashingService.compare(
      password,
      adminUser.getHashedPassword() ?? '',
    );

    if (!isPasswordCorrect) throw new WrongEmailOrPasswordError();

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
