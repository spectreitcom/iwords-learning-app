import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchDictionaryReadModelQuery } from '../queries/search-dictionary-read-model.query';
import { DictionaryReadModel } from '../../read-models/dictionary-read-model';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CollectionWithPagination } from '../../../common/types';

export type SearchDictionaryReadModelQueryResponse =
  CollectionWithPagination<DictionaryReadModel>;

@QueryHandler(SearchDictionaryReadModelQuery)
export class SearchDictionaryReadModelQueryHandler implements IQueryHandler<
  SearchDictionaryReadModelQuery,
  SearchDictionaryReadModelQueryResponse
> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    query: SearchDictionaryReadModelQuery,
  ): Promise<SearchDictionaryReadModelQueryResponse> {
    const { searchText, take, page } = query;

    const records = await this.prismaService.dictionaryReadModel.findMany({
      where: {
        OR: [
          {
            phrase: {
              contains: searchText ?? '',
              mode: 'insensitive',
            },
          },
          {
            translation: {
              contains: searchText ?? '',
              mode: 'insensitive',
            },
          },
        ],
      },
      take,
      skip: (page - 1) * take,
    });

    const total = await this.prismaService.dictionaryReadModel.count({
      where: {
        OR: [
          {
            phrase: {
              contains: searchText ?? '',
              mode: 'insensitive',
            },
          },
          {
            translation: {
              contains: searchText ?? '',
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    const data = records.map(
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

    return {
      data,
      total,
      currentPage: page,
    };
  }
}
