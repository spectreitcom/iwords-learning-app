import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../commands/delete-user.command';
import { UserRepository } from '../ports/user.repository';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { AppError } from '../../../common/errors';
import { IntegrationEvent } from '../../../common/outbox/types';
import { OutboxService } from '../../../common/outbox/outbox.service';

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler
  implements ICommandHandler<DeleteUserCommand, void>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly prismaService: PrismaService,
    private readonly outboxService: OutboxService,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const { clerkId } = command;

    await this.prismaService.$transaction(async (prisma) => {
      const user = await this.userRepository.findByClerkId(clerkId);
      if (!user) throw new AppError('ENTITY_NOT_FOUND', `User not found`);

      await this.userRepository.delete(user.getUserId().value, prisma);

      const event: IntegrationEvent<{ userId: string }> = new IntegrationEvent(
        'user-identity.user-deleted',
        { userId: user.getUserId().value },
        {
          aggregateId: user.getUserId().value,
        },
      );

      await this.outboxService.enqueue(event, prisma);
    });
  }
}
