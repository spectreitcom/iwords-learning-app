import { IQuery } from '@nestjs/cqrs';

export class GetBoxIdsForCurrentRepetitionQuery implements IQuery {
  constructor(public readonly userId: string) {}
}
