import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSentencesByExpressionContextIdsQuery } from '../queries/get-sentences-by-expression-context-ids.query';
import { SentenceView } from '../../views/sentence.view';
import { PrismaService } from '../../../common/prisma/prisma.service';

@QueryHandler(GetSentencesByExpressionContextIdsQuery)
export class GetSentencesByExpressionContextIdsQueryHandler
  implements
    IQueryHandler<GetSentencesByExpressionContextIdsQuery, SentenceView[]>
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    query: GetSentencesByExpressionContextIdsQuery,
  ): Promise<SentenceView[]> {
    const { expressionContextIds } = query;

    const records = await this.prismaService.sentence.findMany({
      where: {
        expressionContextId: {
          in: expressionContextIds,
        },
      },
    });

    return records.map(
      (record) =>
        new SentenceView(
          record.id,
          record.content,
          record.translation,
          record.expressionContextId,
        ),
    );
  }
}
