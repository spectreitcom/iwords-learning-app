import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { IntegrationEvent } from '../../../common/outbox/types';
import { EmailService } from '../ports/email.service';
import { AdminUserCreatedEmail } from '../emails/admin-user-created.email';

type EventPayload = {
  email: string;
};

@EventsHandler(IntegrationEvent)
export class UserIdentityUserCreatedEventHandler
  implements IEventHandler<IntegrationEvent<EventPayload>>
{
  private readonly logger = new Logger(
    `Email Notification Domain - ${UserIdentityUserCreatedEventHandler.name}`,
  );

  constructor(private readonly emailService: EmailService) {}

  async handle(event: IntegrationEvent<EventPayload>) {
    if (event.type !== 'user-identity.user-created') return;
    this.logger.debug(JSON.stringify(event));
    const { email } = event.payload;
    await this.emailService.send(new AdminUserCreatedEmail(email));
  }
}
