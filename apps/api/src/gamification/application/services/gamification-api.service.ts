import { Injectable } from '@nestjs/common';
import { GamificationApi } from '../ports/gamification.api';
import { CommandBus } from '@nestjs/cqrs';
import { SetUpDailyGoalCommand } from '../commands/set-up-daily-goal.command';
import { GetUserDailyGoalQuery } from '../queries/get-user-daily-goal.query';
import { GetUserTodayPointsQuery } from '../queries/get-user-today-points.query';

@Injectable()
export class GamificationApiService implements GamificationApi {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: CommandBus,
  ) {}

  async setUpDailyGoal(userId: string, goal: number): Promise<void> {
    const command = new SetUpDailyGoalCommand(userId, goal);
    return await this.commandBus.execute(command);
  }

  async getUserDailyGoal(userId: string): Promise<number> {
    const query = new GetUserDailyGoalQuery(userId);
    return await this.queryBus.execute(query);
  }

  async getUserTodayPoints(userId: string): Promise<number> {
    const query = new GetUserTodayPointsQuery(userId);
    return await this.queryBus.execute(query);
  }
}
