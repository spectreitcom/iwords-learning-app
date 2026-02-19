import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { IntegrationEvent } from '../../../common/outbox/types';
import { EmailService } from '../ports/email.service';
import { RequestedResetPasswordEmail } from '../emails/requested-reset-password.email';
import { ConfigService } from '@nestjs/config';

type EventPayload = {
  email: string;
  resetPasswordToken: string;
};

@EventsHandler(IntegrationEvent)
export class AdminRequestedResetPasswordEventHandler implements IEventHandler<
  IntegrationEvent<EventPayload>
> {
  private readonly logger = new Logger(
    `Email Notification Domain - ${AdminRequestedResetPasswordEventHandler.name}`,
  );

  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async handle(event: IntegrationEvent<EventPayload>) {
    if (event.type !== 'admin-identity.requested-reset-password') return;
    this.logger.debug(JSON.stringify(event));
    const { email, resetPasswordToken } = event.payload;
    const FRONTEND_URL = this.configService.get<string>('ADMIN_FRONTEND_URL')!;
    await this.emailService.send(
      new RequestedResetPasswordEmail(email, FRONTEND_URL, resetPasswordToken),
    );
  }
}
