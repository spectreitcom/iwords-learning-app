import { IQuery } from '@nestjs/cqrs';

export class IsBoxStartedQuery implements IQuery {
  constructor(
    public readonly boxId: string,
    public readonly userId: string,
  ) {}
}
