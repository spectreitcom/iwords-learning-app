import { IQuery } from '@nestjs/cqrs';

export class GetUserDailyGoalQuery implements IQuery {
  constructor(public readonly userId: string) {}
}
