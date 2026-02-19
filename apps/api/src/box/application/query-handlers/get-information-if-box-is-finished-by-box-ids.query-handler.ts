import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetInformationIfBoxIsFinishedByBoxIdsQuery } from '../queries/get-information-if-box-is-finished-by-box-ids.query';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { BoxIsFinishedView } from '../../view/box-is-finished.view';
import { Clock } from '../../../common/clock/clock';

@QueryHandler(GetInformationIfBoxIsFinishedByBoxIdsQuery)
export class GetInformationIfBoxIsFinishedByBoxIdsQueryHandler implements IQueryHandler<
  GetInformationIfBoxIsFinishedByBoxIdsQuery,
  BoxIsFinishedView[]
> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly clock: Clock,
  ) {}

  async execute(
    query: GetInformationIfBoxIsFinishedByBoxIdsQuery,
  ): Promise<BoxIsFinishedView[]> {
    const { boxIds } = query;

    const today = this.clock.today();

    if (!boxIds || boxIds.length === 0) return [];

    const learnedToday = await this.prismaService.dailyLearnedBox.findMany({
      where: {
        boxId: { in: boxIds },
        createdAt: today,
      },
      select: { boxId: true },
    });

    const finishedSet = new Set(learnedToday.map((r) => r.boxId));

    return boxIds.map(
      (boxId) => new BoxIsFinishedView(boxId, finishedSet.has(boxId)),
    );
  }
}
