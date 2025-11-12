import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetInformationIfBoxIsFinishedByBoxIdsQuery } from '../queries/get-information-if-box-is-finished-by-box-ids.query';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { BoxIsFinishedView } from '../../view/box-is-finished.view';

@QueryHandler(GetInformationIfBoxIsFinishedByBoxIdsQuery)
export class GetInformationIfBoxIsFinishedByBoxIdsQueryHandler
  implements
    IQueryHandler<
      GetInformationIfBoxIsFinishedByBoxIdsQuery,
      BoxIsFinishedView[]
    >
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    query: GetInformationIfBoxIsFinishedByBoxIdsQuery,
  ): Promise<BoxIsFinishedView[]> {
    const { boxIds } = query;
    const now = new Date();
    const yyyy = now.getUTCFullYear();
    const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(now.getUTCDate()).padStart(2, '0');
    const today = new Date(`${yyyy}-${mm}-${dd}T00:00:00.000Z`);

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
