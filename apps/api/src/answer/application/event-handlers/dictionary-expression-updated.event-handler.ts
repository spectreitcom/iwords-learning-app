import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { IntegrationEvent } from '../../../common/outbox/types';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

type EventPayload = {
  id: string;
  phrase: string;
};

@EventsHandler(IntegrationEvent)
export class DictionaryExpressionUpdatedEventHandler implements IEventHandler<
  IntegrationEvent<EventPayload>
> {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly logger = new Logger(
    `Answer Domain - ${DictionaryExpressionUpdatedEventHandler.name}`,
  );

  async handle(event: IntegrationEvent<EventPayload>) {
    if (event.type !== 'dictionary.expression-updated') return null;
    this.logger.debug(JSON.stringify(event));
    const { phrase, id } = event.payload;

    await this.prismaService.answerExpressionContextReadModel.updateMany({
      where: {
        expressionId: id,
      },
      data: {
        phrase,
      },
    });
  }
}
