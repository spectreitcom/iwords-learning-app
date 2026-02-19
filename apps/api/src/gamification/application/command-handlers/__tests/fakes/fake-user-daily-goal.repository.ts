import { UserDailyGoalRepository } from '../../../ports/user-daily-goal.repository';
import { UserDailyGoal } from '../../../../domain/user-daily-goal';
import { UserDailyGoalId } from '../../../../domain/value-objects/user-daily-goal-id';
import { UserId } from '../../../../domain/value-objects/user-id';
import { Goal } from '../../../../domain/value-objects/goal';

type FakeUserDailyGoal = {
  id: string;
  userId: string;
  goal: number;
};

abstract class FakeUserDailyGoalRepositoryClass extends UserDailyGoalRepository {
  abstract getLength(): number;
}

export class FakeUserDailyGoalRepository implements FakeUserDailyGoalRepositoryClass {
  private readonly data = new Map<string, FakeUserDailyGoal>();

  constructor(initialData: FakeUserDailyGoal[] = []) {
    initialData.forEach((item) => this.data.set(item.id, item));
  }

  async findByUserId(userId: string): Promise<UserDailyGoal | null> {
    for (const [_, value] of this.data.entries()) {
      if (value.userId === userId) {
        return new UserDailyGoal(
          UserDailyGoalId.fromString(value.id),
          UserId.fromString(value.userId),
          Goal.create(value.goal),
        );
      }
    }
    return null;
  }

  async save(userDailyGoal: UserDailyGoal): Promise<void> {
    this.data.set(userDailyGoal.getUserDailyGoalId().value, {
      id: userDailyGoal.getUserDailyGoalId().value,
      userId: userDailyGoal.getUserId().value,
      goal: userDailyGoal.getGoal().value,
    });
  }

  getLength(): number {
    return this.data.size;
  }
}
