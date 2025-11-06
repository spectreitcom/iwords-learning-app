import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ExpressionCreatedEvent } from '../../domain/events/expression-created.event';
import { Logger } from '@nestjs/common';

@EventsHandler(ExpressionCreatedEvent)
export class ExpressionCreatedEventHandler
  implements IEventHandler<ExpressionCreatedEvent>
{
  private readonly logger = new Logger(
    `Dictionary Domain - ${ExpressionCreatedEventHandler.name}`,
  );

  handle(event: ExpressionCreatedEvent) {
    this.logger.debug(JSON.stringify(event));
  }
}
