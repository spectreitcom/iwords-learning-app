import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBoxesRepetitionDataQuery } from '../queries/get-boxes-repetition-data.query';
import { BoxRepetitionUserView } from '../../views/box-repetition-user.view';
import { PrismaService } from '../../../common/prisma/prisma.service';

@QueryHandler(GetBoxesRepetitionDataQuery)
export class GetBoxesRepetitionDataQueryHandler
  implements IQueryHandler<GetBoxesRepetitionDataQuery, BoxRepetitionUserView[]>
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    query: GetBoxesRepetitionDataQuery,
  ): Promise<BoxRepetitionUserView[]> {
    const { userId, boxIds } = query;

    if (!boxIds.length) return [];

    const records = await this.prismaService.boxRepetitionUserData.findMany({
      where: {
        userId,
        boxId: { in: boxIds },
      },
    });

    return records.map(
      (record) => new BoxRepetitionUserView(record.boxId, record.count),
    );
  }
}
