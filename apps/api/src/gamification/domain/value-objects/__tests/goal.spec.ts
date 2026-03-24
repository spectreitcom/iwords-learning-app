import { Goal } from '../goal';

describe('Goal', () => {
  it('creates with a positive number', () => {
    const goal = Goal.create(10);
    expect(goal.value).toBe(10);
  });

  it('throws for zero', () => {
    expect(() => Goal.create(0)).toThrow('Goal is not valid');
  });

  it('throws for negative numbers', () => {
    expect(() => Goal.create(-5)).toThrow('Goal is not valid');
  });

  it('throws for NaN', () => {
    expect(() => Goal.create(Number.NaN)).toThrow('Goal is not valid');
  });

  it('compares equality by value', () => {
    const a = Goal.create(15);
    const b = Goal.create(15);
    const c = Goal.create(20);

    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });
});
