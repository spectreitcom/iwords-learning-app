import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserRepetitionsQuery } from '../queries/get-user-repetitions.query';
import { PrismaService } from '../../../common/prisma/prisma.service';

@QueryHandler(GetUserRepetitionsQuery)
export class GetUserRepetitionsQueryHandler
  implements IQueryHandler<GetUserRepetitionsQuery, string[]>
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetUserRepetitionsQuery): Promise<string[]> {
    const { userId } = query;

    const repetitions = await this.prismaService.repetition.findMany({
      where: { userId },
      orderBy: { nextRepetition: 'asc' },
      take: 10,
      select: { expressionContextId: true },
    });

    return repetitions.map((r) => r.expressionContextId);
  }
}
