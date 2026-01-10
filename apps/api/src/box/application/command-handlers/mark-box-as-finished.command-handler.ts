import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MarkBoxAsFinishedCommand } from '../commands/mark-box-as-finished.command';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { OutboxService } from '../../../common/outbox/outbox.service';
import { IntegrationEvent } from '../../../common/outbox/types';

@CommandHandler(MarkBoxAsFinishedCommand)
export class MarkBoxAsFinishedCommandHandler
  implements ICommandHandler<MarkBoxAsFinishedCommand, void>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly outboxService: OutboxService,
  ) {}

  async execute(command: MarkBoxAsFinishedCommand): Promise<void> {
    const { boxId, userId } = command;

    const now = new Date();
    const yyyy = now.getUTCFullYear();
    const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(now.getUTCDate()).padStart(2, '0');
    const today = new Date(`${yyyy}-${mm}-${dd}T00:00:00.000Z`);

    await this.prismaService.$transaction(async (prisma) => {
      let record = await prisma.dailyLearnedBox.findFirst({
        where: {
          userId,
          boxId,
          createdAt: today,
        },
      });

      if (!record) {
        record = await prisma.dailyLearnedBox.create({
          data: {
            userId,
            boxId,
            createdAt: today,
          },
        });
      }

      const event = new IntegrationEvent<{
        boxId: string;
        userId: string;
      }>(
        'box.marked-as-finished',
        {
          boxId: record.boxId,
          userId: record.userId,
        },
        {
          aggregateId: boxId,
        },
      );
      await this.outboxService.enqueue(event, prisma);
    });
  }
}
