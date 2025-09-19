import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ExpressionContextUpdatedEvent } from '../../domain/events/expression-context-updated.event';
import { Logger } from '@nestjs/common';

@EventsHandler(ExpressionContextUpdatedEvent)
export class ExpressionContextUpdatedEventHandler
  implements IEventHandler<ExpressionContextUpdatedEvent>
{
  private readonly logger = new Logger(
    ExpressionContextUpdatedEventHandler.name,
  );

  handle(event: ExpressionContextUpdatedEvent) {
    this.logger.debug(JSON.stringify(event));
  }
}
