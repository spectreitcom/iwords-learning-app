import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SetUpDailyGoalCommand } from '../commands/set-up-daily-goal.command';
import { UserDailyGoalRepository } from '../ports/user-daily-goal.repository';
import { UserDailyGoal } from '../../domain/user-daily-goal';

@CommandHandler(SetUpDailyGoalCommand)
export class SetUpDailyGoalCommandHandler
  implements ICommandHandler<SetUpDailyGoalCommand, void>
{
  constructor(
    private readonly userDailyGoalRepository: UserDailyGoalRepository,
  ) {}

  async execute(command: SetUpDailyGoalCommand): Promise<void> {
    const { userId, goal } = command;

    let userDailyGoal = await this.userDailyGoalRepository.findByUserId(userId);

    if (!userDailyGoal) {
      userDailyGoal = UserDailyGoal.create(goal, userId);
    } else {
      userDailyGoal.updateGoal(goal);
    }

    await this.userDailyGoalRepository.save(userDailyGoal);
  }
}
