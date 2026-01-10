import { IQuery } from '@nestjs/cqrs';

export class GetBoxesByIdsQuery implements IQuery {
  constructor(public readonly boxIds: string[]) {}
}
