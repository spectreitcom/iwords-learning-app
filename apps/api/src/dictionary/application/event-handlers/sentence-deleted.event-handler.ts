import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SentenceDeletedEvent } from '../../domain/events/sentence-deleted.event';
import { Logger } from '@nestjs/common';

@EventsHandler(SentenceDeletedEvent)
export class SentenceDeletedEventHandler
  implements IEventHandler<SentenceDeletedEvent>
{
  private readonly logger = new Logger(SentenceDeletedEventHandler.name);

  handle(event: SentenceDeletedEvent) {
    this.logger.debug(JSON.stringify(event));
  }
}
