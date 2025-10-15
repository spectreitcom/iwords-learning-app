import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { UserRepository } from '../appliaction/ports/user.repository';
import { PrismaUserRepository } from './prisma/prisma-user.repository';
import { UserIdentityInboxRouter } from './user-identity-inbox.router';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    UserIdentityInboxRouter,
  ],
  exports: [UserRepository, UserIdentityInboxRouter],
})
export class InfrastructureModule {}
