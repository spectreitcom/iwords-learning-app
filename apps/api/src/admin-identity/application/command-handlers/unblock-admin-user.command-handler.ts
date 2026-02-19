import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnblockAdminUserCommand } from '../commands/unblock-admin-user.command';
import { AdminUserRepository } from '../ports/admin-user.repository';
import { AppError } from '../../../common/errors';
import { AdminUserValidationService } from '../ports/admin-user-validation.service';

@CommandHandler(UnblockAdminUserCommand)
export class UnblockAdminUserCommandHandler implements ICommandHandler<
  UnblockAdminUserCommand,
  void
> {
  constructor(
    private readonly adminUserRepository: AdminUserRepository,
    private readonly adminUserValidationService: AdminUserValidationService,
  ) {}

  async execute(command: UnblockAdminUserCommand): Promise<void> {
    const { adminUserId, userToUnblockId } = command;

    const isAdminSuperuser =
      await this.adminUserValidationService.isSuperUser(adminUserId);

    if (!isAdminSuperuser) {
      throw new AppError(
        'VALIDATION_ERROR',
        'Only superuser can unblock users',
      );
    }

    const adminUserToUnblock =
      await this.adminUserRepository.findById(userToUnblockId);

    if (!adminUserToUnblock) {
      throw new AppError(
        'ENTITY_NOT_FOUND',
        `Admin user with id ${userToUnblockId} not found`,
      );
    }

    adminUserToUnblock.unblock();
    await this.adminUserRepository.save(adminUserToUnblock);
  }
}
