import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResetPasswordCommand } from '../commands/reset-password.command';
import { HashingService } from '../ports/hashing.service';
import { ResetPasswordTokensStorage } from '../ports/reset-password-tokens.storage';
import { AdminUserRepository } from '../ports/admin-user.repository';
import { AppError } from '../../../common/errors';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordCommandHandler
  implements ICommandHandler<ResetPasswordCommand, void>
{
  constructor(
    private readonly hashingService: HashingService,
    private readonly resetPasswordTokensStorage: ResetPasswordTokensStorage,
    private readonly adminUserRepository: AdminUserRepository,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<void> {
    const { newPassword, token } = command;

    const adminUser =
      await this.adminUserRepository.findByResetPasswordToken(token);

    if (!adminUser) {
      throw new AppError('UNAUTHORIZED', 'Wrong reset password token');
    }

    const resetPasswordTokenValid =
      await this.resetPasswordTokensStorage.validate(
        adminUser.getAdminUserId().value,
      );

    if (!resetPasswordTokenValid) {
      throw new AppError('UNAUTHORIZED', 'Wrong reset password token');
    }

    const hashedPassword = await this.hashingService.hash(newPassword);

    adminUser.updateHashedPassword(hashedPassword);
    await this.adminUserRepository.save(adminUser);
  }
}
