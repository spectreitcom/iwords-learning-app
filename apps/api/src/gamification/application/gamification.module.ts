import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { SetUpDailyGoalCommandHandler } from './command-handlers/set-up-daily-goal.command-handler';
import { GamificationApiService } from './services/gamification-api.service';
import { GetUserDailyGoalQueryHandler } from './query-handlers/get-user-daily-goal.query-handler';
import { AnswerCheckedEventHandler } from './event-handlers/answer-checked.event-handler';
import { GetUserTodayPointsQueryHandler } from './query-handlers/get-user-today-points.query-handler';

const EVENT_HANDLERS = [AnswerCheckedEventHandler];

const COMMAND_HANDLERS = [SetUpDailyGoalCommandHandler];

const QUERY_HANDLERS = [
  GetUserDailyGoalQueryHandler,
  GetUserTodayPointsQueryHandler,
];

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
