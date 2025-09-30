import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BoxDeletedEvent } from '../../domain/events/box-deleted.event';
import { Logger } from '@nestjs/common';

@EventsHandler(BoxDeletedEvent)
export class BoxDeletedEventHandler implements IEventHandler<BoxDeletedEvent> {
  private readonly logger = new Logger(BoxDeletedEventHandler.name);

  handle(event: BoxDeletedEvent) {
    this.logger.debug(JSON.stringify(event));
  }
}
