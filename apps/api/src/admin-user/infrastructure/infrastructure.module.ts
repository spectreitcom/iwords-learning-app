import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { HashingService } from '../application/ports/hashing.service';
import { ArgonHashingService } from './services/argon-hashing.service';
import { AdminUserValidationService } from '../application/ports/admin-user-validation.service';
import { AppAdminUserValidationService } from './services/app-admin-user-validation.service';
import { AdminUserRepository } from '../application/ports/admin-user.repository';
import { PrismaAdminUserRepository } from './prisma/prisma-admin-user.repository';

@Module({
  imports: [PrismaModule],
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
  ],
  exports: [HashingService, AdminUserValidationService, AdminUserRepository],
})
export class InfrastructureModule {}
