import { UserId } from '../user-id';

describe('UserId', () => {
  it('creates from valid UUID string', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    const id = UserId.fromString(uuid);
    expect(id.value).toBe(uuid);
  });

  it('throws for invalid UUID string', () => {
    expect(() => UserId.fromString('not-a-uuid')).toThrow(
      'UserId is not valid',
    );
  });

  it('compares equality by value', () => {
    const uuid1 = '550e8400-e29b-41d4-a716-446655440000';
    const uuid2 = 'd9428888-122b-4bcd-bb55-001234567890';

    const a = UserId.fromString(uuid1);
    const b = UserId.fromString(uuid1);
    const c = UserId.fromString(uuid2);

    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });
});
