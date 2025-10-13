import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { UserRepository } from '../appliaction/ports/user.repository';
import { PrismaUserRepository } from './prisma/prisma-user.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class InfrastructureModule {}
