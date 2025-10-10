import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { IntegrationEvent } from '../../../common/outbox/types';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

type EventPayload = {
  expressionContextId: string;
};

@EventsHandler(IntegrationEvent)
export class DictionaryExpressionContextDeletedEventHandler
  implements IEventHandler<IntegrationEvent<EventPayload>>
{
  private readonly logger = new Logger(
    DictionaryExpressionContextDeletedEventHandler.name,
  );

  constructor(private readonly prismaService: PrismaService) {}

  async handle(event: IntegrationEvent<EventPayload>) {
    if (event.type !== 'dictionary.expression-context-deleted') return null;

    this.logger.debug(JSON.stringify(event));

    const { expressionContextId } = event.payload;

    await this.prismaService.$transaction(async (prisma) => {
      await prisma.answerExpressionContextReadModel.deleteMany({
        where: {
          expressionContextId,
        },
      });
      await prisma.answerSentenceReadModel.deleteMany({
        where: {
          expressionContextId,
        },
      });
    });
  }
}
