import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { NoteApi } from './ports/note.api';
import { CreateNoteCommand } from './commands/create-note.command';
import { CreateNoteCommandResponse } from './command-handlers/create-note.command-handler';
import { UpdateNoteContentCommand } from './commands/update-note-content.command';
import { UpdateNoteTitleCommand } from './commands/update-note-title.command';
import { GetNoteQuery } from './queries/get-note.query';
import { NoteView } from '../views/note.view';
import { GetNotesForExpressionContextQuery } from './queries/get-notes-for-expression-context.query';
import { GetNotesForExpressionContextQueryResponse } from './query-handlers/get-notes-for-expression-context.query-handler';

@Injectable()
export class NoteApiService implements NoteApi {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createNote(
    expressionContextId: string,
    userId: string,
    title: string,
  ): Promise<CreateNoteCommandResponse> {
    return await this.commandBus.execute(
      new CreateNoteCommand(expressionContextId, userId, title),
    );
  }

  async updateNoteContent(
    noteId: string,
    userId: string,
    content: string,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdateNoteContentCommand(noteId, userId, content),
    );
  }

  async updateNoteTitle(
    noteId: string,
    userId: string,
    title: string,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdateNoteTitleCommand(noteId, userId, title),
    );
  }

  async getNote(noteId: string, userId: string): Promise<NoteView> {
    return await this.queryBus.execute(new GetNoteQuery(noteId, userId));
  }

  async getNotesForExpressionContext(
    expressionContextId: string,
    take: number,
    page: number,
  ): Promise<GetNotesForExpressionContextQueryResponse> {
    return await this.queryBus.execute(
      new GetNotesForExpressionContextQuery(expressionContextId, take, page),
    );
  }
}
