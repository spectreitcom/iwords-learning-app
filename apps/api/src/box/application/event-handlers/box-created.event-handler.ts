import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BoxCreatedEvent } from '../../domain/events/box-created.event';
import { Logger } from '@nestjs/common';

@EventsHandler(BoxCreatedEvent)
export class BoxCreatedEventHandler implements IEventHandler<BoxCreatedEvent> {
  private readonly logger = new Logger(BoxCreatedEventHandler.name);

  handle(event: BoxCreatedEvent) {
    this.logger.debug(JSON.stringify(event));
  }
}
