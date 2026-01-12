export abstract class Clock {
  abstract today(): Date;
  abstract now(): Date;
  abstract addDaysFromNow(days: number): Date;
  abstract subtractDaysFromNow(days: number): Date;
  abstract addMillisecondsFromNow(milliseconds: number): Date;
}
