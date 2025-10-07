import { Injectable } from '@nestjs/common';
import { EmailService } from '../application/ports/email.service';
import { BaseEmail } from './base-email';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerEmailService implements EmailService {
  constructor(private readonly mailer: MailerService) {}

  async send(email: BaseEmail): Promise<void> {
    await this.mailer.sendMail({
      to: email.recipient,
      subject: email.subject,
      html: email.body,
    });
  }
}
