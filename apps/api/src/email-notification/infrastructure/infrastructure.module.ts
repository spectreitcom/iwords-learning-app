import { Module } from '@nestjs/common';
import { EmailService } from '../application/ports/email.service';
import { MailerEmailService } from './mailer-email.service';

@Module({
  providers: [
    {
      provide: EmailService,
      useClass: MailerEmailService,
    },
  ],
  exports: [EmailService],
})
export class InfrastructureModule {}
