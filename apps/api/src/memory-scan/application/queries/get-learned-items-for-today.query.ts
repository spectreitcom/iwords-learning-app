import { IQuery } from '@nestjs/cqrs';

export class GetLearnedItemsForTodayQuery implements IQuery {
  constructor(public readonly userId: string) {}
}
