import { IQuery } from '@nestjs/cqrs';

export class GetBoxesRepetitionDataQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly boxIds: string[],
  ) {}
}
