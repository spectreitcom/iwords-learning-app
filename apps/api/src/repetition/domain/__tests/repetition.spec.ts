import { Repetition } from '../repetition';

const VALID_UUID_A = '550e8400-e29b-41d4-a716-446655440000';
const VALID_UUID_B = 'd9428888-122b-4bcd-bb55-001234567890';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('Repetition', () => {
  it('creates a new Repetition with valid inputs', () => {
    const next = new Date(Date.now() + 60_000);

    const rep = Repetition.create(VALID_UUID_A, VALID_UUID_B, next);

    expect(UUID_REGEX.test(rep.getRepetitionId().value)).toBe(true);
    expect(rep.getUserId().value).toBe(VALID_UUID_A);
    expect(rep.getExpressionContextId().value).toBe(VALID_UUID_B);
    expect(rep.getNextRepetition().value.getTime()).toBe(next.getTime());
  });

  it('reschedules to a new future date', () => {
    const next = new Date(Date.now() + 60_000);
    const rep = Repetition.create(VALID_UUID_A, VALID_UUID_B, next);

    const newer = new Date(Date.now() + 120_000);
    rep.reschedule(newer);

    expect(rep.getNextRepetition().value.getTime()).toBe(newer.getTime());
  });

  it('throws when creating with invalid userId', () => {
    const next = new Date(Date.now() + 60_000);
    expect(() => Repetition.create('not-a-uuid', VALID_UUID_B, next)).toThrow(
      'UserId is not valid',
    );
  });

  it('throws when creating with invalid expressionContextId', () => {
    const next = new Date(Date.now() + 60_000);
    expect(() => Repetition.create(VALID_UUID_A, 'not-a-uuid', next)).toThrow(
      'ExpressionContextId is not valid',
    );
  });

  it('throws when creating with non-future nextRepetition', () => {
    const now = new Date();
    expect(() => Repetition.create(VALID_UUID_A, VALID_UUID_B, now)).toThrow(
      'NextRepetitionDate is not valid',
    );
  });

  it('throws when rescheduling to non-future date', () => {
    const next = new Date(Date.now() + 60_000);
    const rep = Repetition.create(VALID_UUID_A, VALID_UUID_B, next);

    const now = new Date();
    expect(() => rep.reschedule(now)).toThrow(
      'NextRepetitionDate is not valid',
    );
  });
});
