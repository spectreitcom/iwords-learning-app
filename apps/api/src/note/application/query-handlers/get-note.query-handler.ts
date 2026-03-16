import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetNoteQuery } from '../queries/get-note.query';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { NoteView } from '../../views/note.view';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetNoteQuery)
export class GetNoteQueryHandler implements IQueryHandler<
  GetNoteQuery,
  NoteView
> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetNoteQuery): Promise<NoteView> {
    const { noteId, userId } = query;

    const record = await this.prismaService.note.findUnique({
      where: {
        id_userId: {
          id: noteId,
          userId,
        },
      },
    });

    if (!record) {
      throw new NotFoundException(`Note with ID ${noteId} not found.`);
    }

    return new NoteView(
      record.id,
      record.expressionContextId,
      record.userId,
      record.title,
      record.content,
      record.createdAt,
      record.updatedAt,
    );
  }
}
