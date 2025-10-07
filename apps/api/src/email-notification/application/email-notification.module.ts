import { Module } from '@nestjs/common';
import { AdminRequestedResetPasswordEventHandler } from './event-handlers/admin-requested-reset-password.event-handler';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

const EVENT_HANDLERS = [AdminRequestedResetPasswordEventHandler];

@Module({
  imports: [
    InfrastructureModule,
    MailerModule.forRoot({
      transport: {
        host: 'localhost',
        port: 1025,
        secure: false,
      },
      defaults: {
        from: '<no-reply@example.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    }),
  ],
  providers: [...EVENT_HANDLERS],
})
export class EmailNotificationModule {}
