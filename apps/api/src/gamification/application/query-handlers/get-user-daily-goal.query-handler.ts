import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserDailyGoalQuery } from '../queries/get-user-daily-goal.query';
import { PrismaService } from '../../../common/prisma/prisma.service';

@QueryHandler(GetUserDailyGoalQuery)
export class GetUserDailyGoalQueryHandler implements IQueryHandler<
  GetUserDailyGoalQuery,
  number
> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetUserDailyGoalQuery): Promise<number> {
    const { userId } = query;

    const record = await this.prismaService.userDailyGoal.findUnique({
      where: { userId },
    });

    return record ? record.goal : 0;
  }
}
