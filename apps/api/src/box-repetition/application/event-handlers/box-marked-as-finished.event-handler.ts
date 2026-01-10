import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { IntegrationEvent } from '../../../common/outbox/types';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

type EventPayload = {
  boxId: string;
  userId: string;
};

@EventsHandler(IntegrationEvent)
export class BoxMarkedAsFinishedEventHandler
  implements IEventHandler<IntegrationEvent<EventPayload>>
{
  private readonly logger = new Logger(
    `Box Repetition Domain - ${BoxMarkedAsFinishedEventHandler.name}`,
  );

  constructor(private readonly prismaService: PrismaService) {}

  async handle(event: IntegrationEvent<EventPayload>) {
    if (event.type !== 'box.marked-as-finished') return;
    this.logger.debug(JSON.stringify(event));

    const { boxId, userId } = event.payload;

    const record = await this.prismaService.boxRepetitionUserData.findUnique({
      where: {
        boxId_userId: {
          boxId,
          userId,
        },
      },
    });

    const nextRepetition = new Date(Date.now() + 24 * 60 * 60 * 1000);

    if (!record) {
      await this.prismaService.boxRepetitionUserData.create({
        data: {
          boxId,
          userId,
          count: 1,
          nextRepetition,
          lastLearned: new Date(),
        },
      });
      return;
    }

    await this.prismaService.boxRepetitionUserData.update({
      where: {
        boxId_userId: {
          userId,
          boxId,
        },
      },
      data: {
        nextRepetition,
        count: {
          increment: 1,
        },
        lastLearned: new Date(),
      },
    });
  }
}
