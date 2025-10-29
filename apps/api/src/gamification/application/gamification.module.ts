import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { SetUpDailyGoalCommandHandler } from './command-handlers/set-up-daily-goal.command-handler';
import { GamificationApiService } from './services/gamification-api.service';

const EVENT_HANDLERS = [];

const COMMAND_HANDLERS = [SetUpDailyGoalCommandHandler];

const QUERY_HANDLERS = [];

@Module({
  imports: [InfrastructureModule, PrismaModule],
  providers: [
    ...EVENT_HANDLERS,
    ...COMMAND_HANDLERS,
    ...QUERY_HANDLERS,
    GamificationApiService,
  ],
  exports: [GamificationApiService],
})
export class GamificationModule {}
