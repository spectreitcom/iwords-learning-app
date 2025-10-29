import { UserDailyGoal } from '../../domain/user-daily-goal';

export abstract class UserDailyGoalRepository {
  abstract save(userDailyGoal: UserDailyGoal): Promise<void>;
  abstract findByUserId(userId: string): Promise<UserDailyGoal | null>;
}
