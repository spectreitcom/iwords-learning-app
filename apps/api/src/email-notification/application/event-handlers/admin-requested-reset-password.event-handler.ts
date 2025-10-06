import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

type EventPayload = {
  email: string;
  resetPasswordToken: string;
};

@EventsHandler(['admin-identity.requested-reset-password'])
export class AdminRequestedResetPasswordEventHandler
  implements IEventHandler<EventPayload>
{
  private readonly logger = new Logger(
    AdminRequestedResetPasswordEventHandler.name,
  );

  handle(event: EventPayload) {
    this.logger.log(JSON.stringify(event));
  }
}
