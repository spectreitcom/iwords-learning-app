import { UserDailyGoal } from '../user-daily-goal';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('UserDailyGoal', () => {
  it('creates a new UserDailyGoal with valid inputs', () => {
    const userId = '550e8400-e29b-41d4-a716-446655440000';
    const goalValue = 10;

    const udg = UserDailyGoal.create(goalValue, userId);

    expect(UUID_REGEX.test(udg.getUserDailyGoalId().value)).toBe(true);
    expect(udg.getUserId().value).toBe(userId);
    expect(udg.getGoal().value).toBe(goalValue);
  });

  it('updates the goal value', () => {
    const userId = '550e8400-e29b-41d4-a716-446655440000';
    const udg = UserDailyGoal.create(5, userId);

    udg.updateGoal(20);

    expect(udg.getGoal().value).toBe(20);
  });

  it('throws when creating with invalid userId', () => {
    expect(() => UserDailyGoal.create(10, 'not-a-uuid')).toThrowError(
      'UserId is not valid',
    );
  });

  it('throws when creating with non-positive or invalid goal', () => {
    const userId = '550e8400-e29b-41d4-a716-446655440000';

    expect(() => UserDailyGoal.create(0, userId)).toThrowError(
      'Goal is not valid',
    );

    expect(() => UserDailyGoal.create(-3, userId)).toThrowError(
      'Goal is not valid',
    );

    expect(() => UserDailyGoal.create(Number.NaN, userId)).toThrowError(
      'Goal is not valid',
    );
  });
});
