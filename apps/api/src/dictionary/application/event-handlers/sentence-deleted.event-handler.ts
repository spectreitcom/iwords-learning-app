import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SentenceDeletedEvent } from '../../domain/events/sentence-deleted.event';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

@EventsHandler(SentenceDeletedEvent)
export class SentenceDeletedEventHandler
  implements IEventHandler<SentenceDeletedEvent>
{
  private readonly logger = new Logger(
    `Dictionary Domain - ${SentenceDeletedEventHandler.name}`,
  );

  constructor(private readonly prismaService: PrismaService) {}

  async handle(event: SentenceDeletedEvent) {
    this.logger.debug(JSON.stringify(event));
    const { sentenceId, expressionContextId } = event;

    const dictionaryReadModel =
      await this.prismaService.dictionaryReadModel.findUnique({
        where: { expressionContextId },
      });

    if (!dictionaryReadModel) return;

    const updatedSentenceIds = dictionaryReadModel.sentenceIds.filter(
      (si) => si !== sentenceId,
    );

    await this.prismaService.dictionaryReadModel.update({
      where: { expressionContextId },
      data: {
        sentenceIds: updatedSentenceIds,
      },
    });
  }
}
