import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlockAdminUserCommand } from '../commands/block-admin-user.command';
import { AdminUserRepository } from '../ports/admin-user.repository';
import { AdminUserValidationService } from '../ports/admin-user-validation.service';
import { AppError } from '../../../common/errors';

@CommandHandler(BlockAdminUserCommand)
export class BlockAdminUserCommandHandler implements ICommandHandler<
  BlockAdminUserCommand,
  void
> {
  constructor(
    private readonly adminUserRepository: AdminUserRepository,
    private readonly adminUserValidationService: AdminUserValidationService,
  ) {}

  async execute(command: BlockAdminUserCommand): Promise<void> {
    const { adminUserId, userToBlockId } = command;

    const isAdminSuperuser =
      await this.adminUserValidationService.isSuperUser(adminUserId);

    if (!isAdminSuperuser) {
      throw new AppError('VALIDATION_ERROR', 'Only superuser can block users');
    }

    const adminUserToBlock =
      await this.adminUserRepository.findById(userToBlockId);

    if (!adminUserToBlock) {
      throw new AppError(
        'ENTITY_NOT_FOUND',
        `Admin user with id ${userToBlockId} not found`,
      );
    }

    adminUserToBlock.block();
    await this.adminUserRepository.save(adminUserToBlock);
  }
}
