import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SentenceCreatedEvent } from '../../domain/events/sentence-created.event';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

@EventsHandler(SentenceCreatedEvent)
export class SentenceCreatedEventHandler
  implements IEventHandler<SentenceCreatedEvent>
{
  private readonly logger = new Logger(
    `Dictionary Domain - ${SentenceCreatedEventHandler.name}`,
  );

  constructor(private readonly prismaService: PrismaService) {}

  async handle(event: SentenceCreatedEvent) {
    this.logger.debug(JSON.stringify(event));
    const { sentenceId, expressionContextId } = event;

    const dictionaryReadModel =
      await this.prismaService.dictionaryReadModel.findUnique({
        where: { expressionContextId },
      });

    if (!dictionaryReadModel) return;

    const sentenceIds = dictionaryReadModel.sentenceIds;
    sentenceIds.push(sentenceId);

    await this.prismaService.dictionaryReadModel.update({
      where: { expressionContextId },
      data: {
        sentenceIds,
      },
    });
  }
}
