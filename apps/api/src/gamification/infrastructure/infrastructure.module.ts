import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { UserDailyGoalRepository } from '../application/ports/user-daily-goal.repository';
import { PrismaUserDailyGoalRepository } from './prisma/prisma-user-daily-goal.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: UserDailyGoalRepository,
      useClass: PrismaUserDailyGoalRepository,
    },
  ],
  exports: [UserDailyGoalRepository],
})
export class InfrastructureModule {}
