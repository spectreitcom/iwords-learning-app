import { NextRepetitionDate } from '../next-repetition-date';

describe('NextRepetitionDate', () => {
  it('creates with a future date', () => {
    const future = new Date(Date.now() + 60_000);
    const d = NextRepetitionDate.create(future);
    expect(d.value.getTime()).toBe(future.getTime());
  });

  it('throws when date is now or in the past', () => {
    const now = new Date();
    const past = new Date(Date.now() - 1_000);

    expect(() => NextRepetitionDate.create(now)).toThrow(
      'NextRepetitionDate is not valid',
    );
    expect(() => NextRepetitionDate.create(past)).toThrow(
      'NextRepetitionDate is not valid',
    );
  });

  it('throws when value is not a valid date', () => {
    // @ts-expect-error intentional wrong type
    expect(() => NextRepetitionDate.create('not-a-date')).toThrow(
      'NextRepetitionDate is not valid',
    );
    // Invalid Date instance
    expect(() => NextRepetitionDate.create(new Date('invalid'))).toThrow(
      'NextRepetitionDate is not valid',
    );
  });
});
