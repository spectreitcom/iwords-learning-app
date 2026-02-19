import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SentenceUpdatedEvent } from '../../domain/events/sentence-updated.event';
import { Logger } from '@nestjs/common';

@EventsHandler(SentenceUpdatedEvent)
export class SentenceUpdatedEventHandler implements IEventHandler<SentenceUpdatedEvent> {
  private readonly logger = new Logger(
    `Dictionary Domain - ${SentenceUpdatedEventHandler.name}`,
  );

  handle(event: SentenceUpdatedEvent) {
    this.logger.debug(JSON.stringify(event));
  }
}
