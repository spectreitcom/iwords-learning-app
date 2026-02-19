import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { IntegrationEvent } from '../../../common/outbox/types';
import { EmailService } from '../ports/email.service';
import { ConfigService } from '@nestjs/config';
import { AdminUserInvitedEmail } from '../emails/admin-user-invited.email';

type EventPayload = {
  email: string;
  resetPasswordToken: string;
};

@EventsHandler(IntegrationEvent)
export class AdminAdminUserInvitedEventHandler implements IEventHandler<
  IntegrationEvent<EventPayload>
> {
  private readonly logger = new Logger(
    `Email Notification Domain - ${AdminAdminUserInvitedEventHandler.name}`,
  );

  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async handle(event: IntegrationEvent<EventPayload>) {
    if (event.type !== 'admin-identity.user-invited') return;
    this.logger.debug(JSON.stringify(event));
    const { email, resetPasswordToken } = event.payload;
    const FRONTEND_URL = this.configService.get<string>('ADMIN_FRONTEND_URL')!;
    await this.emailService.send(
      new AdminUserInvitedEmail(email, FRONTEND_URL, resetPasswordToken),
    );
  }
}
