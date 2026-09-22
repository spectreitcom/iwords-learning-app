import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { IntegrationEvent } from '../../../common/outbox/types';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { Logger } from '@nestjs/common';

type EventPayload = {
  id: string;
  expressionContextIds: string[];
};

@EventsHandler(IntegrationEvent)
export class DictionaryExpressionDeletedEventHandler implements IEventHandler<
  IntegrationEvent<EventPayload>
> {
  private readonly logger = new Logger(
    DictionaryExpressionDeletedEventHandler.name,
  );

  constructor(private readonly prisma: PrismaService) {}

  async handle(event: IntegrationEvent<EventPayload>) {
    if (event.type !== 'dictionary.expression-deleted') return;
    this.logger.debug(JSON.stringify(event));

    const { id } = event.payload;

    await this.prisma.memoryScanLearnedItems.deleteMany({
      where: {
        expressionId: id,
      },
    });
  }
}
