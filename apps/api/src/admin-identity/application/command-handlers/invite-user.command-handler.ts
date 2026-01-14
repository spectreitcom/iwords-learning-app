import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InviteUserCommand } from '../commands/invite-user.command';
import { AdminUserRepository } from '../ports/admin-user.repository';
import { ResetPasswordTokensStorage } from '../ports/reset-password-tokens.storage';
import { OutboxService } from '../../../common/outbox/outbox.service';
import { AdminUserValidationService } from '../ports/admin-user-validation.service';
import { AppError } from '../../../common/errors';
import { AdminUser } from '../../domain/admin-user';
import { randomUUID } from 'node:crypto';
import { IntegrationEvent } from '../../../common/outbox/types';
import { TransactionRunner } from '../../../common/prisma/transaction-runner';

@CommandHandler(InviteUserCommand)
export class InviteUserCommandHandler
  implements ICommandHandler<InviteUserCommand, void>
{
  constructor(
    private readonly adminUserRepository: AdminUserRepository,
    private readonly resetPasswordTokensStorage: ResetPasswordTokensStorage,
    private readonly outboxService: OutboxService,
    private readonly adminUserValidationService: AdminUserValidationService,
    private readonly transactionRunner: TransactionRunner,
  ) {}

  async execute(command: InviteUserCommand): Promise<void> {
    const { email, name } = command;
    await this.transactionRunner.runInTransaction(async (prisma) => {
      const isEmailTaken = await this.adminUserValidationService.isEmailTaken(
        email,
        prisma,
      );

      if (isEmailTaken) {
        throw new AppError(
          'ALREADY_EXISTS',
          `Admin user with email ${email} is already taken`,
        );
      }

      const resetPasswordToken = randomUUID();

      const adminUser = AdminUser.create(email, name, null, false);
      adminUser.updateResetPasswordToken(resetPasswordToken);

      await this.resetPasswordTokensStorage.insert(
        adminUser.getAdminUserId().value,
        resetPasswordToken,
      );

      const event = new IntegrationEvent<{
        resetPasswordToken: string;
        email: string;
      }>(
        'admin-identity.user-invited',
        { resetPasswordToken, email: adminUser.getEmail().value },
        {
          aggregateId: adminUser.getAdminUserId().value,
        },
      );

      await this.adminUserRepository.save(adminUser, prisma);
      await this.outboxService.enqueue(event, prisma);
    });
  }
}
