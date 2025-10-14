import { Module } from '@nestjs/common';
import { DictionaryModule } from '../../dictionary/application/dictionary.module';
import { AdminIdentityModule } from '../../admin-identity/application/admin-identity.module';
import { LocalStrategy } from './auth/local.strategy';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { DictionaryController } from './controllers/dictionary.controller';
import { BoxModule } from '../../box/application/box.module';
import { BoxController } from './controllers/box.controller';
import { UserIdentityModule } from '../../user-identity/appliaction/user-identity.module';
import { UsersController } from './controllers/users.controller';

@Module({
  imports: [
    DictionaryModule,
    AdminIdentityModule,
    BoxModule,
    UserIdentityModule,
  ],
  controllers: [
    AuthController,
    DictionaryController,
    BoxController,
    UsersController,
  ],
  providers: [LocalStrategy, JwtStrategy, LocalAuthGuard],
})
export class AdminGatewayModule {}
