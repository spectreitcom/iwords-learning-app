import { ExpressionContextId } from '../expression-context-id';

describe('ExpressionContextId (Repetition)', () => {
  it('creates from valid UUID string', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    const id = ExpressionContextId.fromString(uuid);
    expect(id.value).toBe(uuid);
  });

  it('throws for invalid UUID string', () => {
    expect(() => ExpressionContextId.fromString('not-a-uuid')).toThrowError(
      'ExpressionContextId is not valid',
    );
  });

  it('compares equality by value', () => {
    const uuid1 = '550e8400-e29b-41d4-a716-446655440000';
    const uuid2 = 'd9428888-122b-4bcd-bb55-001234567890';

    const a = ExpressionContextId.fromString(uuid1);
    const b = ExpressionContextId.fromString(uuid1);
    const c = ExpressionContextId.fromString(uuid2);

    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });
});
