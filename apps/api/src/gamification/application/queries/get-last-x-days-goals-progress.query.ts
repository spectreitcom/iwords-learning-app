import { IQuery } from '@nestjs/cqrs';

export class GetLastXDaysGoalsProgressQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly days: number = 7,
  ) {}
}
