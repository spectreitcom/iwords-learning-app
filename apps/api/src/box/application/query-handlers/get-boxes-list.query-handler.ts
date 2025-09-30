import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBoxesListQuery } from '../queries/get-boxes-list.query';
import { CollectionWithPagination } from '../../../common/types';
import { BoxView } from '../../view/box.view';
import { PrismaService } from '../../../common/prisma/prisma.service';

export type GetBoxesListQueryResponse = CollectionWithPagination<BoxView>;

@QueryHandler(GetBoxesListQuery)
export class GetBoxesListQueryHandler
  implements IQueryHandler<GetBoxesListQuery, GetBoxesListQueryResponse>
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetBoxesListQuery): Promise<GetBoxesListQueryResponse> {
    const { page, take } = query;

    const records = await this.prismaService.box.findMany({
      skip: (page - 1) * take,
      take,
    });

    const total = await this.prismaService.box.count();

    const data: BoxView[] = records.map(
      (rec) => new BoxView(rec.id, rec.title, rec.expressionContextIds),
    );

    return {
      data,
      currentPage: page,
      total,
    };
  }
}
