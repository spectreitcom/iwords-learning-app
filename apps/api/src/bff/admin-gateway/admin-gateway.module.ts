import { Module } from '@nestjs/common';
import { DictionaryModule } from '../../dictionary/application/dictionary.module';
import { AdminIdentityModule } from '../../admin-identity/application/admin-identity.module';
import { LocalStrategy } from './auth/local.strategy';
import { JwtStrategy } from './auth/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [DictionaryModule, AdminIdentityModule],
  controllers: [],
  providers: [
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AdminGatewayModule {}
