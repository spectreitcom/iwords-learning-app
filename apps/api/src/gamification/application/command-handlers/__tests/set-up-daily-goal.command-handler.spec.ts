import { SetUpDailyGoalCommandHandler } from '../set-up-daily-goal.command-handler';
import { FakeUserDailyGoalRepository } from './fakes/fake-user-daily-goal.repository';
import { randomUUID } from 'node:crypto';

describe('SetUpDailyGoalCommandHandler', () => {
  it('should create daily goal when goal is not set at all', async () => {
    const fakeUserDailyGoalRepository = new FakeUserDailyGoalRepository();
    const handler = new SetUpDailyGoalCommandHandler(
      fakeUserDailyGoalRepository,
    );

    const USER_ID = randomUUID();
    const GOAL = 10;

    await handler.execute({
      userId: USER_ID,
      goal: GOAL,
    });

    const createdUserDailyGoal =
      await fakeUserDailyGoalRepository.findByUserId(USER_ID);

    expect(fakeUserDailyGoalRepository.getLength()).toBe(1);
    expect(createdUserDailyGoal).toBeDefined();
    expect(createdUserDailyGoal?.getUserId().value).toEqual(USER_ID);
    expect(createdUserDailyGoal?.getGoal().value).toEqual(GOAL);
  });

  it('should update daily goal when goal was already set', async () => {
    const USER_ID = randomUUID();
    const DEFAULT_GOAL = 10;
    const GOAL = 20;

    const fakeUserDailyGoalRepository = new FakeUserDailyGoalRepository([
      {
        goal: DEFAULT_GOAL,
        userId: USER_ID,
        id: randomUUID(),
      },
    ]);
    const handler = new SetUpDailyGoalCommandHandler(
      fakeUserDailyGoalRepository,
    );

    await handler.execute({
      userId: USER_ID,
      goal: GOAL,
    });

    const createdUserDailyGoal =
      await fakeUserDailyGoalRepository.findByUserId(USER_ID);

    expect(fakeUserDailyGoalRepository.getLength()).toBe(1);
    expect(createdUserDailyGoal).toBeDefined();
    expect(createdUserDailyGoal?.getUserId().value).toEqual(USER_ID);
    expect(createdUserDailyGoal?.getGoal().value).toEqual(GOAL);
  });
});
