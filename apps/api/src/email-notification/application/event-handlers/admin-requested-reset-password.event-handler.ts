import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { IntegrationEvent } from '../../../common/outbox/types';
import { EmailService } from '../ports/email.service';
import { RequestedResetPasswordEmail } from '../emails/requested-reset-password.email';

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

  constructor(private readonly emailService: EmailService) {}

  async handle(event: IntegrationEvent<EventPayload>) {
    this.logger.debug(JSON.stringify(event));
    await this.emailService.send(
      new RequestedResetPasswordEmail(
        event.payload.email,
        event.payload.resetPasswordToken,
      ),
    );
  }
}
