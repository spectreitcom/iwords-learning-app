import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ExpressionContextUpdatedEvent } from '../../domain/events/expression-context-updated.event';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

@EventsHandler(ExpressionContextUpdatedEvent)
export class ExpressionContextUpdatedEventHandler
  implements IEventHandler<ExpressionContextUpdatedEvent>
{
  private readonly logger = new Logger(
    `Dictionary Domain - ${ExpressionContextUpdatedEventHandler.name}`,
  );

  constructor(private readonly prismaService: PrismaService) {}

  async handle(event: ExpressionContextUpdatedEvent) {
    this.logger.debug(JSON.stringify(event));
    const {
      expressionContextId,
      isCountable,
      translation,
      forms,
      definition,
      definitionTranslation,
    } = event;

    await this.prismaService.dictionaryReadModel.update({
      where: { expressionContextId },
      data: {
        isCountable,
        translation,
        forms: forms ? forms : [],
        definition,
        definitionTranslation,
      },
    });
  }
}
