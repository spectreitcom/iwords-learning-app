import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SentenceCreatedEvent } from '../../domain/events/sentence-created.event';
import { Logger } from '@nestjs/common';

@EventsHandler(SentenceCreatedEvent)
export class SentenceCreatedEventHandler
  implements IEventHandler<SentenceCreatedEvent>
{
  private readonly logger = new Logger(SentenceCreatedEventHandler.name);

  handle(event: SentenceCreatedEvent) {
    this.logger.debug(JSON.stringify(event));
  }
}
