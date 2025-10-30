import { RepetitionId } from '../repetition-id';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('RepetitionId', () => {
  it('creates a new UUID', () => {
    const id = RepetitionId.create();
    expect(UUID_REGEX.test(id.value)).toBe(true);
  });

  it('creates from valid string', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    const id = RepetitionId.fromString(uuid);
    expect(id.value).toBe(uuid);
  });

  it('throws for invalid UUID string', () => {
    expect(() => RepetitionId.fromString('not-a-uuid')).toThrow(
      'RepetitionId is not valid',
    );
  });

  it('equality by value', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    const a = RepetitionId.fromString(uuid);
    const b = RepetitionId.fromString(uuid);
    expect(a.equals(b)).toBe(true);
  });
});
