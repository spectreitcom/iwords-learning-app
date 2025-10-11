import { IQuery } from '@nestjs/cqrs';

export class GetUsersListQuery implements IQuery {
  constructor(
    public readonly take: number,
    public readonly page: number,
  ) {}
}
