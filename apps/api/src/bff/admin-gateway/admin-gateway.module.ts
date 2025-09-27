import { Module } from '@nestjs/common';
import { DictionaryModule } from '../../dictionary/application/dictionary.module';
import { AdminIdentityModule } from '../../admin-identity/application/admin-identity.module';
import { LocalStrategy } from './auth/local.strategy';
import { JwtStrategy } from './auth/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthController } from './controllers/auth.controller';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { DictionaryController } from './controllers/dictionary.controller';
import { BoxModule } from '../../box/application/box.module';

@Module({
  imports: [DictionaryModule, AdminIdentityModule, BoxModule],
  controllers: [AuthController, DictionaryController],
  providers: [
    LocalStrategy,
    JwtStrategy,
    LocalAuthGuard,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AdminGatewayModule {}
