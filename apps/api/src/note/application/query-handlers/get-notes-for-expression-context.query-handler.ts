import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetNotesForExpressionContextQuery } from '../queries/get-notes-for-expression-context.query';
import { CollectionWithPagination } from '../../../common/types';
import { NoteView } from '../../views/note.view';
import { PrismaService } from '../../../common/prisma/prisma.service';

export type GetNotesForExpressionContextQueryResponse =
  CollectionWithPagination<NoteView>;

@QueryHandler(GetNotesForExpressionContextQuery)
export class GetNotesForExpressionContextQueryHandler implements IQueryHandler<
  GetNotesForExpressionContextQuery,
  GetNotesForExpressionContextQueryResponse
> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    query: GetNotesForExpressionContextQuery,
  ): Promise<GetNotesForExpressionContextQueryResponse> {
    const { expressionContextId, take, page } = query;

    const records = await this.prismaService.note.findMany({
      where: {
        expressionContextId,
      },
      take,
      skip: (page - 1) * take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const data = records.map(
      (record) =>
        new NoteView(
          record.id,
          record.expressionContextId,
          record.userId,
          record.title,
          record.content,
          record.createdAt,
          record.updatedAt,
        ),
    );

    const total = await this.prismaService.note.count({
      where: {
        expressionContextId,
      },
    });

    return {
      data,
      total,
      currentPage: page,
    };
  }
}
