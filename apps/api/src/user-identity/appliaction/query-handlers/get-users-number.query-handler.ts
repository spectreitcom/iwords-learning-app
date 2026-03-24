import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUsersNumberQuery } from '../queries/get-users-number.query';
import { PrismaService } from '../../../common/prisma/prisma.service';

@QueryHandler(GetUsersNumberQuery)
export class GetUsersNumberQueryHandler implements IQueryHandler<
  GetUsersNumberQuery,
  number
> {
  constructor(private readonly prisma: PrismaService) {}

  execute(): Promise<number> {
    return this.prisma.user.count();
  }
}
