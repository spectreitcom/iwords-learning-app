import { UserDailyGoalId } from './value-objects/user-daily-goal-id';
import { UserId } from './value-objects/user-id';
import { Goal } from './value-objects/goal';

export class UserDailyGoal {
  private readonly userDailyGoalId: UserDailyGoalId;
  private readonly userId: UserId;
  private goal: Goal;

  constructor(userDailyGoalId: UserDailyGoalId, userId: UserId, goal: Goal) {
    this.userDailyGoalId = userDailyGoalId;
    this.userId = userId;
    this.goal = goal;
  }

  static create(goal: number, userId: string) {
    const userDailyGoalId = UserDailyGoalId.create();
    return new UserDailyGoal(
      userDailyGoalId,
      UserId.fromString(userId),
      Goal.create(goal),
    );
  }

  updateGoal(goal: number) {
    this.goal = Goal.create(goal);
  }

  getUserDailyGoalId() {
    return this.userDailyGoalId;
  }

  getUserId() {
    return this.userId;
  }

  getGoal() {
    return this.goal;
  }
}
