import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ExpressionContextDeletedEvent } from '../../domain/events/expression-context-deleted.event';
import { Logger } from '@nestjs/common';

@EventsHandler(ExpressionContextDeletedEvent)
export class ExpressionContextDeletedEventHandler
  implements IEventHandler<ExpressionContextDeletedEvent>
{
  private readonly logger = new Logger(
    ExpressionContextDeletedEventHandler.name,
  );

  handle(event: ExpressionContextDeletedEvent) {
    this.logger.debug(JSON.stringify(event));
  }
}
