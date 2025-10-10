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
    ScheduleModule.forRoot(),
    EmailNotificationModule,
    OutboxModule,
    CqrsModule.forRoot(),
    AdminGatewayModule,
    GatewayModule,
    CliModule,
  ],
})
export class AppModule {}
