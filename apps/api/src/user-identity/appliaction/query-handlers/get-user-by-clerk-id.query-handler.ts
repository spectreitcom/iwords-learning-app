import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByClerkIdQuery } from '../queries/get-user-by-clerk-id.query';
import { UserView } from '../../views/user.view';
import { PrismaService } from '../../../common/prisma/prisma.service';

@QueryHandler(GetUserByClerkIdQuery)
export class GetUserByClerkIdQueryHandler
  implements IQueryHandler<GetUserByClerkIdQuery, UserView | null>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetUserByClerkIdQuery): Promise<UserView | null> {
    const { clerkId } = query;

    const record = await this.prisma.user.findUnique({
      where: {
        clerkId,
      },
    });

    if (!record) return null;

    return new UserView(record.id, record.email, record.name, record.blocked);
  }
}
