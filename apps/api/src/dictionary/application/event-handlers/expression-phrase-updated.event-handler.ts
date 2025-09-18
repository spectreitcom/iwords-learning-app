import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ExpressionPhraseUpdatedEvent } from '../../domain/events/expression-phrase-updated.event';
import { Logger } from '@nestjs/common';

@EventsHandler(ExpressionPhraseUpdatedEvent)
export class ExpressionPhraseUpdatedEventHandler
  implements IEventHandler<ExpressionPhraseUpdatedEvent>
{
  private readonly logger = new Logger(ExpressionPhraseUpdatedEventHandler.name);

  handle(event: ExpressionPhraseUpdatedEvent) {
    this.logger.debug(JSON.stringify(event));
  }
}