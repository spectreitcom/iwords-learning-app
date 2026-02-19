import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MarkBoxAsFinishedCommand } from '../commands/mark-box-as-finished.command';
import { OutboxService } from '../../../common/outbox/outbox.service';
import { IntegrationEvent } from '../../../common/outbox/types';
import { TransactionRunner } from '../../../common/prisma/transaction-runner';
import { DailyLearnedBoxRepository } from '../ports/daily-learned-box.repository';
import { DailyLearnedBox } from '../../domain/daily-learned-box';

@CommandHandler(MarkBoxAsFinishedCommand)
export class MarkBoxAsFinishedCommandHandler implements ICommandHandler<
  MarkBoxAsFinishedCommand,
  void
> {
  constructor(
    private readonly outboxService: OutboxService,
    private readonly transactionRunner: TransactionRunner,
    private readonly dailyLearnedBoxRepository: DailyLearnedBoxRepository,
  ) {}

  async execute(command: MarkBoxAsFinishedCommand): Promise<void> {
    const { boxId, userId } = command;

    await this.transactionRunner.runInTransaction(async (prisma) => {
      let dailyLearnedBox = await this.dailyLearnedBoxRepository.findForToday(
        boxId,
        userId,
        prisma,
      );

      if (!dailyLearnedBox) {
        dailyLearnedBox = DailyLearnedBox.create(userId, boxId);
        await this.dailyLearnedBoxRepository.save(dailyLearnedBox, prisma);
      }

      const event = new IntegrationEvent<{
        boxId: string;
        userId: string;
      }>(
        'box.marked-as-finished',
        {
          boxId: dailyLearnedBox.getBoxId().value,
          userId: dailyLearnedBox.getUserId().value,
        },
        {
          aggregateId: boxId,
        },
      );
      await this.outboxService.enqueue(event, prisma);
    });
  }
}
