import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ExpressionContextIdRemovedEvent } from '../../domain/events/expression-context-id-removed.event';
import { Logger } from '@nestjs/common';

@EventsHandler(ExpressionContextIdRemovedEvent)
export class ExpressionContextIdRemovedEventHandler
  implements IEventHandler<ExpressionContextIdRemovedEvent>
{
  private readonly logger = new Logger(
    ExpressionContextIdRemovedEventHandler.name,
  );

  handle(event: ExpressionContextIdRemovedEvent) {
    this.logger.debug(JSON.stringify(event));
  }
}
