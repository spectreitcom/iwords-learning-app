import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserTodayPointsQuery } from '../queries/get-user-today-points.query';
import { PrismaService } from '../../../common/prisma/prisma.service';

@QueryHandler(GetUserTodayPointsQuery)
export class GetUserTodayPointsQueryHandler
  implements IQueryHandler<GetUserTodayPointsQuery, number>
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetUserTodayPointsQuery): Promise<number> {
    const { userId } = query;

    const startOfDayUtc = new Date();
    startOfDayUtc.setUTCHours(0, 0, 0, 0);
    const nextDayUtc = new Date(startOfDayUtc);
    nextDayUtc.setUTCDate(nextDayUtc.getUTCDate() + 1);

    const today = await this.prismaService.userDailyStats.findFirst({
      where: {
        userId,
        createdAt: { gte: startOfDayUtc, lt: nextDayUtc },
      },
      select: { points: true },
    });

    return today?.points ?? 0;
  }
}
