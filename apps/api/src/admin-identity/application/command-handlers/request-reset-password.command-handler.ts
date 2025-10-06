import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestResetPasswordCommand } from '../commands/request-reset-password.command';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { AppError } from '../../../common/errors';
import { OutboxService } from '../../../common/outbox/outbox.service';
import { IIntegrationEvent } from '../../../common/outbox/types';
import { ResetPasswordTokensStorage } from '../ports/reset-password-tokens.storage';
import { randomUUID } from 'node:crypto';

@CommandHandler(RequestResetPasswordCommand)
export class RequestResetPasswordCommandHandler
  implements ICommandHandler<RequestResetPasswordCommand, void>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly outboxService: OutboxService,
    private readonly resetTokensStorage: ResetPasswordTokensStorage,
  ) {}

  async execute(command: RequestResetPasswordCommand): Promise<void> {
    const { email } = command;
    await this.prismaService.$transaction(async (prisma) => {
      const adminUser = await prisma.adminUser.findUnique({
        where: {
          email,
        },
      });

      if (!adminUser) {
        throw new AppError(
          'ENTITY_NOT_FOUND',
          `Admin user with email ${email} not found`,
        );
      }

      const resetPasswordToken = randomUUID();

      const event: IIntegrationEvent = {
        name: 'admin-identity.requested-reset-password',
        aggregateId: adminUser.id,
        payload: { resetPasswordToken, email: adminUser.email },
      };

      await this.resetTokensStorage.insert(adminUser.id, resetPasswordToken);
      await this.outboxService.enqueue(event, prisma);
    });
  }
}
