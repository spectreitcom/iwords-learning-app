import { IQuery } from '@nestjs/cqrs';

export class SearchDictionaryReadModelQuery implements IQuery {
  constructor(
    public readonly searchText: string,
    public readonly take: number,
    public readonly page: number,
  ) {}
}
