import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangePasswordCommand } from '../commands/change-password.command';
import { AdminUserRepository } from '../ports/admin-user.repository';
import { AppError } from '../../../common/errors';
import { HashingService } from '../ports/hashing.service';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordCommandHandler
  implements ICommandHandler<ChangePasswordCommand, void>
{
  constructor(
    private readonly adminUserRepository: AdminUserRepository,
    private readonly hashingService: HashingService,
  ) {}

  async execute(command: ChangePasswordCommand): Promise<void> {
    const { newPassword, existingPassword, adminUserId } = command;

    const adminUser = await this.adminUserRepository.findById(adminUserId);

    if (!adminUser) {
      throw new AppError(
        'ENTITY_NOT_FOUND',
        `Admin user with id ${adminUserId} not found`,
      );
    }

    const isExistingPasswordValid = await this.hashingService.compare(
      existingPassword,
      adminUser.getHashedPassword() as string,
    );

    if (!isExistingPasswordValid) {
      throw new AppError('VALIDATION_ERROR', 'Wrong existing password');
    }

    const newHashedPassword = await this.hashingService.hash(newPassword);

    adminUser.updateHashedPassword(newHashedPassword);
    await this.adminUserRepository.save(adminUser);
  }
}
