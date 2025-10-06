import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { HashingService } from '../application/ports/hashing.service';
import { ArgonHashingService } from './services/argon-hashing.service';
import { AdminUserValidationService } from '../application/ports/admin-user-validation.service';
import { AppAdminUserValidationService } from './services/app-admin-user-validation.service';
import { AdminUserRepository } from '../application/ports/admin-user.repository';
import { PrismaAdminUserRepository } from './prisma/prisma-admin-user.repository';
import { AccessTokenService } from '../application/ports/access-token.service';
import { JwtAccessTokenService } from './services/jwt-access-token.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenService } from '../application/ports/refresh-token.service';
import { JwtRefreshTokenService } from './services/jwt-refresh-token.service';
import { RefreshTokenStorage } from '../application/ports/refresh-token.storage';
import { RedisRefreshTokenStorage } from './services/redis-refresh-token.storage';
import { ResetPasswordTokensStorage } from '../application/ports/reset-password-tokens.storage';
import { RedisResetPasswordTokensStorage } from './services/redis-reset-password-tokens.storage';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '3600s',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: ArgonHashingService,
    },
    {
      provide: AdminUserValidationService,
      useClass: AppAdminUserValidationService,
    },
    {
      provide: AdminUserRepository,
      useClass: PrismaAdminUserRepository,
    },
    {
      provide: AccessTokenService,
      useClass: JwtAccessTokenService,
    },
    {
      provide: RefreshTokenService,
      useClass: JwtRefreshTokenService,
    },
    {
      provide: RefreshTokenStorage,
      useClass: RedisRefreshTokenStorage,
    },
    {
      provide: ResetPasswordTokensStorage,
      useClass: RedisResetPasswordTokensStorage,
    },
  ],
  exports: [
    HashingService,
    AdminUserValidationService,
    AdminUserRepository,
    AccessTokenService,
    RefreshTokenService,
    RefreshTokenStorage,
    ResetPasswordTokensStorage,
  ],
})
export class InfrastructureModule {}
