import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ExpressionContextIdAddedEvent } from '../../domain/events/expression-context-id-added.event';
import { Logger } from '@nestjs/common';

@EventsHandler(ExpressionContextIdAddedEvent)
export class ExpressionContextIdAddedEventHandler implements IEventHandler<ExpressionContextIdAddedEvent> {
  private readonly logger = new Logger(
    `Box Domain - ${ExpressionContextIdAddedEventHandler.name}`,
  );

  handle(event: ExpressionContextIdAddedEvent) {
    this.logger.debug(JSON.stringify(event));
  }
}
