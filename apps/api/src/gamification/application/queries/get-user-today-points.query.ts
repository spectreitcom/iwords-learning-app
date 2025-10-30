import { IQuery } from '@nestjs/cqrs';

export class GetUserTodayPointsQuery implements IQuery {
  constructor(public readonly userId: string) {}
}
