import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BoxUpdatedEvent } from '../../domain/events/box-updated.event';
import { Logger } from '@nestjs/common';

@EventsHandler(BoxUpdatedEvent)
export class BoxUpdatedEventHandler implements IEventHandler<BoxUpdatedEvent> {
  private readonly logger = new Logger(
    `Box Domain - ${BoxUpdatedEventHandler.name}`,
  );

  handle(event: BoxUpdatedEvent) {
    this.logger.debug(JSON.stringify(event));
  }
}
