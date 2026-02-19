import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBoxesByIdsQuery } from '../queries/get-boxes-by-ids.query';
import { BoxView } from '../../view/box.view';
import { PrismaService } from '../../../common/prisma/prisma.service';

@QueryHandler(GetBoxesByIdsQuery)
export class GetBoxesByIdsQueryHandler implements IQueryHandler<
  GetBoxesByIdsQuery,
  BoxView[]
> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetBoxesByIdsQuery): Promise<BoxView[]> {
    const { boxIds } = query;

    const records = await this.prismaService.box.findMany({
      where: { id: { in: boxIds } },
    });

    return records.map(
      (record) =>
        new BoxView(
          record.id,
          record.title,
          record.expressionContextIds,
          record.createdAt,
        ),
    );
  }
}
