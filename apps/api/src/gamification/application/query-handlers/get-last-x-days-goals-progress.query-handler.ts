import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLastXDaysGoalsProgressQuery } from '../queries/get-last-x-days-goals-progress.query';
import { DailyProgressView } from '../../views/daily-progress.view';
import { PrismaService } from '../../../common/prisma/prisma.service';

@QueryHandler(GetLastXDaysGoalsProgressQuery)
export class GetLastXDaysGoalsProgressQueryHandler implements IQueryHandler<
  GetLastXDaysGoalsProgressQuery,
  DailyProgressView[]
> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    query: GetLastXDaysGoalsProgressQuery,
  ): Promise<DailyProgressView[]> {
    const { userId } = query;
    const daysInput = Math.floor(query.days ?? 7);
    if (!Number.isFinite(daysInput) || daysInput <= 0) return [];
    const days = Math.min(daysInput, 30);

    const userDailyGoal = await this.prismaService.userDailyGoal.findUnique({
      where: { userId },
    });

    const endExclusive = new Date();
    endExclusive.setUTCHours(0, 0, 0, 0);
    endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);

    const startInclusive = new Date(endExclusive);
    startInclusive.setUTCDate(startInclusive.getUTCDate() - days);

    const stats = await this.prismaService.userDailyStats.findMany({
      where: {
        userId,
        createdAt: { gte: startInclusive, lt: endExclusive },
      },
      select: { createdAt: true, points: true },
      orderBy: { createdAt: 'asc' },
    });

    const byDay = new Map<string, number>();
    for (const s of stats) {
      const dayKey = s.createdAt.toISOString().slice(0, 10);
      byDay.set(dayKey, (byDay.get(dayKey) ?? 0) + s.points);
    }

    const result: DailyProgressView[] = [];
    const goal = userDailyGoal?.goal ?? 0;

    const dayCursor = new Date(endExclusive);
    dayCursor.setUTCDate(dayCursor.getUTCDate() - days);

    for (let i = 0; i < days; i++) {
      const dateStr = dayCursor.toISOString().slice(0, 10); //
      const points = byDay.get(dateStr) ?? 0;
      const progress = goal > 0 ? Math.min(1, points / goal) : 0;
      result.push(new DailyProgressView(dateStr, progress));
      dayCursor.setUTCDate(dayCursor.getUTCDate() + 1);
    }

    return result;
  }
}
