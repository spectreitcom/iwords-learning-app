import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AdminGatewayModule } from './bff/admin-gateway/admin-gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CqrsModule.forRoot(),
    AdminGatewayModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
