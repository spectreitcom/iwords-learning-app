import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetExpressionsListQuery } from '../queries/get-expressions-list.query';
import { CollectionWithPagination } from '../../../common/types';
import { ExpressionView } from '../../views/expression.view';
import { PrismaService } from '../../../common/prisma/prisma.service';

export type GetExpressionListQueryResponse =
  CollectionWithPagination<ExpressionView>;

@QueryHandler(GetExpressionsListQuery)
export class GetExpressionsListQueryHandler implements IQueryHandler<
  GetExpressionsListQuery,
  GetExpressionListQueryResponse
> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    query: GetExpressionsListQuery,
  ): Promise<GetExpressionListQueryResponse> {
    const { take, page, searchText } = query;

    const records = await this.prismaService.expression.findMany({
      where: {
        phrase: {
          contains: searchText ?? '',
          mode: 'insensitive',
        },
      },
      take,
      skip: (page - 1) * take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await this.prismaService.expression.count({
      where: {
        phrase: {
          contains: searchText ?? '',
          mode: 'insensitive',
        },
      },
    });

    const data = records.map(
      (record) => new ExpressionView(record.id, record.phrase),
    );

    return {
      data,
      total,
      currentPage: page,
    };
  }
}
