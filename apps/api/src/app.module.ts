import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AdminGatewayModule } from './bff/admin-gateway/admin-gateway.module';
import { envSchema } from '../env-schema';
import { CliModule } from './cli/cli.module';
import { OutboxModule } from './common/outbox/outbox.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailNotificationModule } from './email-notification/application/email-notification.module';
import { GatewayModule } from './bff/gateway/gateway.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './bff/filters/http-exception.filter';
import { WebhooksModule } from './bff/webhooks/webhooks.module';
import { InboxModule } from './common/inbox/inbox.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    ScheduleModule.forRoot(),
    EmailNotificationModule,
    OutboxModule,
    CqrsModule.forRoot(),
    AdminGatewayModule,
    GatewayModule,
    WebhooksModule,
    CliModule,
    InboxModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
