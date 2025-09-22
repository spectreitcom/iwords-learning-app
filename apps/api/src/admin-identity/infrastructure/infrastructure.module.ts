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

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '10s',
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
  ],
  exports: [
    HashingService,
    AdminUserValidationService,
    AdminUserRepository,
    AccessTokenService,
  ],
})
export class InfrastructureModule {}
