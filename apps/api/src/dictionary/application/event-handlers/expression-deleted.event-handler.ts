import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ExpressionDeletedEvent } from '../../domain/events/expression-deleted.event';
import { Logger } from '@nestjs/common';

@EventsHandler(ExpressionDeletedEvent)
export class ExpressionDeletedEventHandler
  implements IEventHandler<ExpressionDeletedEvent>
{
  private readonly logger = new Logger(ExpressionDeletedEventHandler.name);

  handle(event: ExpressionDeletedEvent) {
    this.logger.debug(JSON.stringify(event));
  }
}
