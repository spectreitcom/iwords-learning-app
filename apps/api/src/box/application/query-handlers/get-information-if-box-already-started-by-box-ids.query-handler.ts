import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetInformationIfBoxAlreadyStartedByBoxIdsQuery } from '../queries/get-information-if-box-already-started-by-box-ids.query';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { BoxIsStartedView } from '../../view/box-is-started.view';

@QueryHandler(GetInformationIfBoxAlreadyStartedByBoxIdsQuery)
export class GetInformationIfBoxAlreadyStartedByBoxIdsQueryHandler implements IQueryHandler<
  GetInformationIfBoxAlreadyStartedByBoxIdsQuery,
  BoxIsStartedView[]
> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    query: GetInformationIfBoxAlreadyStartedByBoxIdsQuery,
  ): Promise<BoxIsStartedView[]> {
    const { boxIds, userId } = query;
    if (!boxIds.length) return [];

    const records = await this.prismaService.beginBox.findMany({
      where: {
        userId,
        boxId: { in: boxIds },
      },
    });

    const alreadyStartedIds = new Set(records.map((r) => r.boxId));

    return boxIds.map(
      (boxId) => new BoxIsStartedView(boxId, alreadyStartedIds.has(boxId)),
    );
  }
}
