import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { IntegrationEvent } from '../../../common/outbox/types';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { Logger } from '@nestjs/common';

type EventPayload = {
  expressionContextId: string;
};

@EventsHandler(IntegrationEvent)
export class DictionaryExpressionContextDeletedEventHandler implements IEventHandler<
  IntegrationEvent<EventPayload>
> {
  private readonly logger = new Logger(
    DictionaryExpressionContextDeletedEventHandler.name,
  );

  constructor(private readonly prismaService: PrismaService) {}

  async handle(event: IntegrationEvent<EventPayload>) {
    if (event.type !== 'dictionary.expression-context-deleted') return;
    this.logger.debug(JSON.stringify(event));

    const { expressionContextId } = event.payload;

    await this.prismaService.memoryScanLearnedItems.deleteMany({
      where: {
        expressionContextId,
      },
    });
  }
}
