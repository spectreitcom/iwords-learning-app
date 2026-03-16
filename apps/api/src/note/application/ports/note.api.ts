import { CreateNoteCommandResponse } from '../command-handlers/create-note.command-handler';
import { NoteView } from '../../views/note.view';
import { GetNotesForExpressionContextQueryResponse } from '../query-handlers/get-notes-for-expression-context.query-handler';

export abstract class NoteApi {
  abstract createNote(
    expressionContextId: string,
    userId: string,
    title: string,
  ): Promise<CreateNoteCommandResponse>;

  abstract updateNoteContent(
    noteId: string,
    userId: string,
    content: string,
  ): Promise<void>;

  abstract updateNoteTitle(
    noteId: string,
    userId: string,
    title: string,
  ): Promise<void>;

  abstract deleteNote(noteId: string, userId: string): Promise<void>;

  abstract getNote(noteId: string, userId: string): Promise<NoteView>;

  abstract getNotesForExpressionContext(
    expressionContextId: string,
    take: number,
    page: number,
  ): Promise<GetNotesForExpressionContextQueryResponse>;
}
