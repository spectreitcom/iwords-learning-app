import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { IntegrationEvent } from '../../../common/outbox/types';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

type EventPayload = {
  expressionContextId: string;
  expressionId: string;
  phrase: string;
  type: string;
  translation: string;
  forms: [string, string, string] | null;
  isIrregular: boolean;
  isCountable: boolean;
};

@EventsHandler(IntegrationEvent)
export class DictionaryExpressionContextCreatedEventHandler
  implements IEventHandler<IntegrationEvent<EventPayload>>
{
  private readonly logger = new Logger(
    `Answer Domain - ${DictionaryExpressionContextCreatedEventHandler.name}`,
  );

  constructor(private readonly prismaService: PrismaService) {}

  async handle(event: IntegrationEvent<EventPayload>) {
    if (event.type !== 'dictionary.expression-context-created') return null;

    this.logger.debug(JSON.stringify(event));

    const {
      expressionId,
      expressionContextId,
      isCountable,
      isIrregular,
      phrase,
      translation,
      forms,
      type,
    } = event.payload;

    await this.prismaService.answerExpressionContextReadModel.create({
      data: {
        expressionId,
        expressionContextId,
        isCountable,
        isIrregular,
        phrase,
        translation,
        forms: forms ? forms : [],
        type,
      },
    });
  }
}
