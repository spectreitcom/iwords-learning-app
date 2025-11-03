import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { IntegrationEvent } from '../../../common/outbox/types';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { Logger } from '@nestjs/common';

type EventPayload = {
  expressionContextId: string;
  sentenceId?: string;
  correct: boolean;
  userId: string;
};

@EventsHandler(IntegrationEvent)
export class AnswerCheckedEventHandler
  implements IEventHandler<IntegrationEvent<EventPayload>>
{
  private readonly logger = new Logger(AnswerCheckedEventHandler.name);

  constructor(private readonly prismaService: PrismaService) {}

  async handle(event: IntegrationEvent<EventPayload>) {
    if (event.type !== 'answer.answer-checked') return;
    this.logger.debug(JSON.stringify(event));

    const { correct, userId } = event.payload;

    if (!correct) return;

    const startOfDayUtc = new Date();
    startOfDayUtc.setUTCHours(0, 0, 0, 0);
    const nextDayUtc = new Date(startOfDayUtc);
    nextDayUtc.setUTCDate(nextDayUtc.getUTCDate() + 1);

    const todayStats = await this.prismaService.userDailyStats.findFirst({
      where: {
        userId,
        createdAt: { gte: startOfDayUtc, lt: nextDayUtc },
      },
      select: { id: true },
    });

    if (todayStats) {
      await this.prismaService.userDailyStats.update({
        where: { id: todayStats.id },
        data: { points: { increment: 2 } },
      });
      return;
    }

    await this.prismaService.userDailyStats.create({
      data: { userId, points: 2 },
    });
  }
}
