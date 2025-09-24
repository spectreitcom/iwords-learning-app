import { IQuery } from '@nestjs/cqrs';

export class GetExpressionsListQuery implements IQuery {
  constructor(
    public readonly take: number,
    public readonly page: number,
    public readonly searchText: string | undefined,
  ) {}
}
