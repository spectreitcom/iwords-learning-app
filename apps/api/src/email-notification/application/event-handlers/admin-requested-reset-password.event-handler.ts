import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { IntegrationEvent } from '../../../common/outbox/types';

type EventPayload = {
  email: string;
  resetPasswordToken: string;
};

@EventsHandler(IntegrationEvent)
export class AdminRequestedResetPasswordEventHandler
  implements IEventHandler<IntegrationEvent<EventPayload>>
{
  private readonly logger = new Logger(
    AdminRequestedResetPasswordEventHandler.name,
  );

  handle(event: IntegrationEvent<EventPayload>) {
    this.logger.debug(JSON.stringify(event));
  }
}
