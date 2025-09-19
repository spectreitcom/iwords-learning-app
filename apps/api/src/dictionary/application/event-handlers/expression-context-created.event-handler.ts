import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ExpressionContextCreatedEvent } from '../../domain/events/expression-context-created.event';
import { Logger } from '@nestjs/common';

@EventsHandler(ExpressionContextCreatedEvent)
export class ExpressionContextCreatedEventHandler
  implements IEventHandler<ExpressionContextCreatedEvent>
{
  private readonly logger = new Logger(ExpressionContextCreatedEventHandler.name);

  handle(event: ExpressionContextCreatedEvent) {
    this.logger.debug(JSON.stringify(event));
  }
}