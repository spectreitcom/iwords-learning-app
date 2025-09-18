import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AdminGatewayModule } from './bff/admin-gateway/admin-gateway.module';
import { envSchema } from '../env-schema';

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
    CqrsModule.forRoot(),
    AdminGatewayModule,
  ],
})
export class AppModule {}
