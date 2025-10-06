import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AdminGatewayModule } from './bff/admin-gateway/admin-gateway.module';
import { envSchema } from '../env-schema';
import { CliModule } from './cli/cli.module';
import { OutboxModule } from './common/outbox/outbox.module';
import { ScheduleModule } from '@nestjs/schedule';

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
    OutboxModule,
    CqrsModule.forRoot(),
    AdminGatewayModule,
    CliModule,
  ],
})
export class AppModule {}
