import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MarkBoxAsFinishedCommand } from '../commands/mark-box-as-finished.command';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { OutboxService } from '../../../common/outbox/outbox.service';
import { IntegrationEvent } from '../../../common/outbox/types';
import { Clock } from '../../../common/clock/clock';

@CommandHandler(MarkBoxAsFinishedCommand)
export class MarkBoxAsFinishedCommandHandler
  implements ICommandHandler<MarkBoxAsFinishedCommand, void>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly outboxService: OutboxService,
    private readonly clock: Clock,
  ) {}

  async execute(command: MarkBoxAsFinishedCommand): Promise<void> {
    const { boxId, userId } = command;
    const today = this.clock.today();

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
