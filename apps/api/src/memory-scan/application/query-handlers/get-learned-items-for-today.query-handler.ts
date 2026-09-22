import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLearnedItemsForTodayQuery } from '../queries/get-learned-items-for-today.query';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { Clock } from '../../../common/clock/clock';
import { LearnedItemForTodayView } from '../../views/learned-item-for-today.view';

@QueryHandler(GetLearnedItemsForTodayQuery)
export class GetLearnedItemsForTodayQueryHandler implements IQueryHandler<
  GetLearnedItemsForTodayQuery,
  LearnedItemForTodayView[]
> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly clock: Clock,
  ) {}

  async execute(
    query: GetLearnedItemsForTodayQuery,
  ): Promise<LearnedItemForTodayView[]> {
    const { userId } = query;
    const today = this.clock.today();

    const records = await this.prismaService.memoryScanLearnedItems.findMany({
      where: {
        userId,
        createdAt: today,
      },
    });

    return records.map(
      (record) =>
        new LearnedItemForTodayView(
          record.id,
          record.userId,
          record.expressionContextId,
          record.expressionId,
          record.createdAt,
        ),
    );
  }
}
