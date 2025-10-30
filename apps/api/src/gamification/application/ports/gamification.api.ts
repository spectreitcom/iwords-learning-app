export abstract class GamificationApi {
  abstract setUpDailyGoal(userId: string, goal: number): Promise<void>;
  abstract getUserDailyGoal(userId: string): Promise<number>;
  abstract getUserTodayPoints(userId: string): Promise<number>;
}
