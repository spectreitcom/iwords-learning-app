import { IQuery } from '@nestjs/cqrs';

export class GetUsersListQuery implements IQuery {
  constructor(
    public readonly adminUserId: string,
    public readonly page: number,
    public readonly take: number,
  ) {}
}
