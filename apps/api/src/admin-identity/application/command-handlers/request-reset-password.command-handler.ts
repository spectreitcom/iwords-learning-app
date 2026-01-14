import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestResetPasswordCommand } from '../commands/request-reset-password.command';
import { AppError } from '../../../common/errors';
import { OutboxService } from '../../../common/outbox/outbox.service';
import { ResetPasswordTokensStorage } from '../ports/reset-password-tokens.storage';
import { randomUUID } from 'node:crypto';
import { IntegrationEvent } from '../../../common/outbox/types';
import { AdminUserRepository } from '../ports/admin-user.repository';
import { TransactionRunner } from '../../../common/prisma/transaction-runner';

@CommandHandler(RequestResetPasswordCommand)
export class RequestResetPasswordCommandHandler
  implements ICommandHandler<RequestResetPasswordCommand, void>
{
  constructor(
    private readonly outboxService: OutboxService,
    private readonly resetTokensStorage: ResetPasswordTokensStorage,
    private readonly adminUserRepository: AdminUserRepository,
    private readonly transactionRunner: TransactionRunner,
  ) {}

  async execute(command: RequestResetPasswordCommand): Promise<void> {
    const { email } = command;
    await this.transactionRunner.runInTransaction(async (prisma) => {
      const adminUser = await this.adminUserRepository.findByEmail(
        email,
        prisma,
      );

      if (!adminUser) {
        throw new AppError(
          'ENTITY_NOT_FOUND',
          `Admin user with email ${email} not found`,
        );
      }

      const resetPasswordToken = randomUUID();

      adminUser.updateResetPasswordToken(resetPasswordToken);

      const event = new IntegrationEvent<{
        resetPasswordToken: string;
        email: string;
      }>(
        'admin-identity.requested-reset-password',
        { resetPasswordToken, email: adminUser.getEmail().value },
        {
          aggregateId: adminUser.getAdminUserId().value,
        },
      );

      await this.resetTokensStorage.insert(
        adminUser.getAdminUserId().value,
        resetPasswordToken,
      );

      await this.adminUserRepository.save(adminUser, prisma);
      await this.outboxService.enqueue(event, prisma);
    });
  }
}
