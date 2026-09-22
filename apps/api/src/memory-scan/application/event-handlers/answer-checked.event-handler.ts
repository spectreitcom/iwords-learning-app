import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { IntegrationEvent } from '../../../common/outbox/types';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { Logger } from '@nestjs/common';

type EventPayload = {
  expressionContextId: string;
  sentenceId?: string;
  correct: boolean;
  userId: string;
  expressionId: string;
};

@EventsHandler(IntegrationEvent)
export class AnswerCheckedEventHandler implements IEventHandler<
  IntegrationEvent<EventPayload>
> {
  private readonly logger = new Logger(AnswerCheckedEventHandler.name);

  constructor(private readonly prismaService: PrismaService) {}

  async handle(event: IntegrationEvent<EventPayload>) {
    if (event.type !== 'answer.answer-checked') return;
    this.logger.debug(JSON.stringify(event));

    const { userId, expressionContextId, expressionId } = event.payload;

    await this.prismaService.memoryScanLearnedItems.create({
      data: {
        expressionContextId,
        expressionId,
        userId,
      },
    });
  }
}
