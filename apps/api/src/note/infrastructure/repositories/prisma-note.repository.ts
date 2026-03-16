import { Injectable } from '@nestjs/common';
import { NoteRepository } from '../../application/ports/note.repository';
import { Note } from '../../domain/note';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { PrismaTx } from '../../../common/types';
import { NoteId } from '../../domain/value-objects/note-id';
import { NoteUserId } from '../../domain/value-objects/note-user-id';
import { NoteExpressionContextId } from '../../domain/value-objects/note-expression-context-id';
import { NoteTitle } from '../../domain/value-objects/note-title';

@Injectable()
export class PrismaNoteRepository implements NoteRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(note: Note, tx?: PrismaTx): Promise<void> {
    const prisma = tx ?? this.prismaService;
    await prisma.note.upsert({
      where: { id: note.getNoteId().value },
      update: {
        title: note.getTitle().value,
        content: note.getContent(),
      },
      create: {
        id: note.getNoteId().value,
        userId: note.getUserId().value,
        expressionContextId: note.getExpressionContextId().value,
        title: note.getTitle().value,
        content: note.getContent(),
      },
    });
  }

  async findById(noteId: string, tx?: PrismaTx): Promise<Note | null> {
    const prisma = tx ?? this.prismaService;
    const record = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!record) {
      return null;
    }

    return new Note(
      NoteId.fromString(record.id),
      NoteUserId.fromString(record.userId),
      NoteExpressionContextId.fromString(record.expressionContextId),
      NoteTitle.fromString(record.title),
      record.content ?? undefined,
    );
  }
}
