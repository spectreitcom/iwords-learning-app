import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IsBoxStartedQuery } from '../queries/is-box-started.query';
import { PrismaService } from '../../../common/prisma/prisma.service';

@QueryHandler(IsBoxStartedQuery)
export class IsBoxStartedQueryHandler
  implements IQueryHandler<IsBoxStartedQuery, boolean>
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: IsBoxStartedQuery): Promise<boolean> {
    const { boxId, userId } = query;

    const record = await this.prismaService.beginBox.findUnique({
      where: {
        userId_boxId: {
          userId,
          boxId,
        },
      },
    });

    return !!record;
  }
}
