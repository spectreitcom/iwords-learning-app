import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDictionaryReadModelsByExpressionContextIdsQuery } from '../queries/get-dictionary-read-models-by-expression-context-ids.query';
import { DictionaryReadModel } from '../../read-models/dictionary-read-model';
import { PrismaService } from '../../../common/prisma/prisma.service';

@QueryHandler(GetDictionaryReadModelsByExpressionContextIdsQuery)
export class GetDictionaryReadModelsByExpressionContextIdsQueryHandler
  implements
    IQueryHandler<
      GetDictionaryReadModelsByExpressionContextIdsQuery,
      DictionaryReadModel[]
    >
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    query: GetDictionaryReadModelsByExpressionContextIdsQuery,
  ): Promise<DictionaryReadModel[]> {
    const { expressionContextIds } = query;

    if (!expressionContextIds.length) return [];

    const records = await this.prismaService.dictionaryReadModel.findMany({
      where: {
        expressionContextId: {
          in: expressionContextIds,
        },
      },
    });

    return records.map(
      (record) =>
        new DictionaryReadModel(
          record.id,
          record.phrase,
          record.translation,
          record.expressionContextId,
          record.expressionId,
          record.type,
          record.forms ? (record.forms as [string, string, string]) : null,
          record.isCountable,
          record.isIrregular,
          record.definition,
          record.definitionTranslation,
        ),
    );
  }
}
