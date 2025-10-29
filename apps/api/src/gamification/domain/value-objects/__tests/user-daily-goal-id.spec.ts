import { UserDailyGoalId } from '../user-daily-goal-id';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('UserDailyGoalId', () => {
  it('creates a new valid UUID with create()', () => {
    const id = UserDailyGoalId.create();
    expect(UUID_REGEX.test(id.value)).toBe(true);
  });

  it('creates from valid UUID string', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    const id = UserDailyGoalId.fromString(uuid);
    expect(id.value).toBe(uuid);
  });

  it('throws for invalid UUID string', () => {
    expect(() => UserDailyGoalId.fromString('invalid')).toThrowError(
      'UserDailyGoalId is not valid',
    );
  });

  it('compares equality by value', () => {
    const uuid1 = '550e8400-e29b-41d4-a716-446655440000';
    const uuid2 = 'd9428888-122b-4bcd-bb55-001234567890';

    const a = UserDailyGoalId.fromString(uuid1);
    const b = UserDailyGoalId.fromString(uuid1);
    const c = UserDailyGoalId.fromString(uuid2);

    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });
});
