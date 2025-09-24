import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetExpressionContextsListQuery } from '../queries/get-expression-contexts-list.query';
import { CollectionWithPagination } from '../../../common/types';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { ExpressionContextListItemView } from '../../views/expression-context-list-item.view';

export type GetExpressionContextsListQueryResponse =
  CollectionWithPagination<ExpressionContextListItemView>;

@QueryHandler(GetExpressionContextsListQuery)
export class GetExpressionContextsListQueryHandler
  implements
    IQueryHandler<
      GetExpressionContextsListQuery,
      GetExpressionContextsListQueryResponse
    >
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    query: GetExpressionContextsListQuery,
  ): Promise<GetExpressionContextsListQueryResponse> {
    const { expressionId, take, page } = query;

    const records = await this.prismaService.expressionContext.findMany({
      where: {
        expressionId,
      },
      take,
      skip: (page - 1) * take,
    });

    const data = records.map(
      (record) =>
        new ExpressionContextListItemView(
          record.id,
          record.expressionId,
          record.translation,
          record.type,
        ),
    );

    const total = await this.prismaService.expressionContext.count({
      where: {
        expressionId,
      },
    });

    return {
      data,
      total,
      currentPage: page,
    };
  }
}
