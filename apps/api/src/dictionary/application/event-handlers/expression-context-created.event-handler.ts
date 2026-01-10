import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ExpressionContextCreatedEvent } from '../../domain/events/expression-context-created.event';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

@EventsHandler(ExpressionContextCreatedEvent)
export class ExpressionContextCreatedEventHandler
  implements IEventHandler<ExpressionContextCreatedEvent>
{
  private readonly logger = new Logger(
    `Dictionary Domain - ${ExpressionContextCreatedEventHandler.name}`,
  );

  constructor(private readonly prismaService: PrismaService) {}

  async handle(event: ExpressionContextCreatedEvent) {
    this.logger.debug(JSON.stringify(event));
    const {
      expressionId,
      expressionContextId,
      type,
      isIrregular,
      isCountable,
      translation,
      forms,
    } = event;

    const expression = await this.prismaService.expression.findUnique({
      where: {
        id: expressionId,
      },
    });

    if (!expression) return;

    await this.prismaService.dictionaryReadModel.create({
      data: {
        expressionContextId,
        type,
        isIrregular,
        isCountable,
        translation,
        forms: forms ?? [],
        phrase: expression.phrase,
        expressionId,
      },
    });
  }
}
