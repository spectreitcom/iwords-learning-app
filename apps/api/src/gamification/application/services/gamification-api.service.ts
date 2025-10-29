import { Injectable } from '@nestjs/common';
import { GamificationApi } from '../ports/gamification.api';
import { CommandBus } from '@nestjs/cqrs';
import { SetUpDailyGoalCommand } from '../commands/set-up-daily-goal.command';

@Injectable()
export class GamificationApiService implements GamificationApi {
  constructor(private readonly commandBus: CommandBus) {}

  async setUpDailyGoal(userId: string, goal: number): Promise<void> {
    const command = new SetUpDailyGoalCommand(userId, goal);
    return await this.commandBus.execute(command);
  }
}
