import { Module } from '@nestjs/common';
import { AdminRequestedResetPasswordEventHandler } from './event-handlers/admin-requested-reset-password.event-handler';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { join } from 'node:path';
import { AdminAdminUserInvitedEventHandler } from './event-handlers/admin-admin-user-invited.event-handler';
import { UserIdentityUserCreatedEventHandler } from './event-handlers/user-identity-user-created.event-handler';

const EVENT_HANDLERS = [
  AdminRequestedResetPasswordEventHandler,
  AdminAdminUserInvitedEventHandler,
  UserIdentityUserCreatedEventHandler,
];

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
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    }),
  ],
  providers: [...EVENT_HANDLERS],
})
export class EmailNotificationModule {}
