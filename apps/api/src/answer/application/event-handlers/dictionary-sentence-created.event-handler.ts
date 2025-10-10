import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { IntegrationEvent } from '../../../common/outbox/types';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

type EventPayload = {
  sentenceId: string;
  content: string;
  translation: string;
  expressionContextId: string;
  expressionId: string;
};

@EventsHandler(IntegrationEvent)
export class DictionarySentenceCreatedEventHandler
  implements IEventHandler<IntegrationEvent<EventPayload>>
{
  private readonly logger = new Logger(
    DictionarySentenceCreatedEventHandler.name,
  );

  constructor(private readonly prismaService: PrismaService) {}

  async handle(event: IntegrationEvent<EventPayload>) {
    if (event.type !== 'dictionary.sentence-created') return null;

    this.logger.debug(JSON.stringify(event));

    const {
      sentenceId,
      expressionContextId,
      content,
      translation,
      expressionId,
    } = event.payload;

    await this.prismaService.answerSentenceReadModel.create({
      data: {
        sentenceId,
        expressionId,
        expressionContextId,
        content,
        translation,
      },
    });
  }
}
