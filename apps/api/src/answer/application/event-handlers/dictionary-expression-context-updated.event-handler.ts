import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { IntegrationEvent } from '../../../common/outbox/types';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

type EventPayload = {
  expressionContextId: string;
  expressionId: string;
  translation: string;
  forms: [string, string, string] | null;
  isIrregular: boolean;
  isCountable: boolean;
};

@EventsHandler(IntegrationEvent)
export class DictionaryExpressionContextUpdatedEventHandler
  implements IEventHandler<IntegrationEvent<EventPayload>>
{
  private readonly logger = new Logger(
    `Answer Domain - ${DictionaryExpressionContextUpdatedEventHandler.name}`,
  );

  constructor(private readonly prismaService: PrismaService) {}

  async handle(event: IntegrationEvent<EventPayload>) {
    if (event.type !== 'dictionary.expression-context-updated') return null;

    this.logger.debug(JSON.stringify(event));

    const {
      expressionId,
      expressionContextId,
      isCountable,
      isIrregular,
      translation,
      forms,
    } = event.payload;

    const record =
      await this.prismaService.answerExpressionContextReadModel.findUnique({
        where: {
          expressionContextId,
          expressionId,
        },
      });

    if (!record) return null;

    await this.prismaService.answerExpressionContextReadModel.update({
      where: {
        expressionContextId,
        expressionId,
      },
      data: {
        isCountable,
        isIrregular,
        translation,
        forms: forms ? forms : [],
      },
    });
  }
}
