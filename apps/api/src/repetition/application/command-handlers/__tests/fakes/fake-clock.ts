import { Clock } from '../../../../../common/clock/clock';

export class FakeClock extends Clock {
  constructor(private readonly nowValue: Date = new Date()) {
    super();
  }

  today(): Date {
    return new Date(
      this.nowValue.getFullYear(),
      this.nowValue.getMonth(),
      this.nowValue.getDate(),
    );
  }

  now(): Date {
    return this.nowValue;
  }

  addDaysFromNow(days: number): Date {
    const result = new Date(this.nowValue);
    result.setDate(result.getDate() + days);
    return result;
  }

  subtractDaysFromNow(days: number): Date {
    const result = new Date(this.nowValue);
    result.setDate(result.getDate() - days);
    return result;
  }

  addMillisecondsFromNow(milliseconds: number): Date {
    return new Date(this.nowValue.getTime() + milliseconds);
  }
}
