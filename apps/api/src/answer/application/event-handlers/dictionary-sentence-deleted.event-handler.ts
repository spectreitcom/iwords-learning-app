import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { IntegrationEvent } from '../../../common/outbox/types';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

type EventPayload = {
  sentenceId: string;
};

@EventsHandler(IntegrationEvent)
export class DictionarySentenceDeletedEventHandler implements IEventHandler<
  IntegrationEvent<EventPayload>
> {
  private readonly logger = new Logger(
    `Answer Domain - ${DictionarySentenceDeletedEventHandler.name}`,
  );

  constructor(private readonly prismaService: PrismaService) {}

  async handle(event: IntegrationEvent<EventPayload>) {
    if (event.type !== 'dictionary.sentence-deleted') return null;

    this.logger.debug(JSON.stringify(event));

    const { sentenceId } = event.payload;

    const record = await this.prismaService.answerSentenceReadModel.findUnique({
      where: {
        sentenceId,
      },
    });

    if (!record) return null;

    await this.prismaService.answerSentenceReadModel.delete({
      where: {
        sentenceId,
      },
    });
  }
}
