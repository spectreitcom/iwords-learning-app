import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResendInvitationEmailCommand } from '../commands/resend-invitation-email.command';
import { AdminUserRepository } from '../ports/admin-user.repository';
import { OutboxService } from '../../../common/outbox/outbox.service';
import { ResetPasswordTokensStorage } from '../ports/reset-password-tokens.storage';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { AppError } from '../../../common/errors';
import { randomUUID } from 'node:crypto';
import { IntegrationEvent } from '../../../common/outbox/types';

@CommandHandler(ResendInvitationEmailCommand)
export class ResendInvitationEmailCommandHandler
  implements ICommandHandler<ResendInvitationEmailCommand, void>
{
  constructor(
    private readonly adminUserRepository: AdminUserRepository,
    private readonly outboxService: OutboxService,
    private readonly resetTokensStorage: ResetPasswordTokensStorage,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(command: ResendInvitationEmailCommand): Promise<void> {
    const { adminUserId } = command;
    await this.prismaService.$transaction(async (prisma) => {
      const adminUser = await this.adminUserRepository.findById(adminUserId);
      if (!adminUser) {
        throw new AppError(
          'ENTITY_NOT_FOUND',
          `Admin user with id ${adminUserId} not found`,
        );
      }

      const resetPasswordToken = randomUUID();
      adminUser.updateResetPasswordToken(resetPasswordToken);

      await this.resetTokensStorage.insert(
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
