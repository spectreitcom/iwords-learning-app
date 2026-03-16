import { AggregateRoot } from '@nestjs/cqrs';
import { NoteId } from './value-objects/note-id';
import { NoteUserId } from './value-objects/note-user-id';
import { NoteExpressionContextId } from './value-objects/note-expression-context-id';
import { NoteTitle } from './value-objects/note-title';

export class Note extends AggregateRoot {
  private readonly noteId: NoteId;
  private readonly userId: NoteUserId;
  private readonly expressionContextId: NoteExpressionContextId;
  private title: NoteTitle;
  private content?: string;

  constructor(
    noteId: NoteId,
    userId: NoteUserId,
    expressionContextId: NoteExpressionContextId,
    title: NoteTitle,
    content?: string,
  ) {
    super();

    this.noteId = noteId;
    this.userId = userId;
    this.expressionContextId = expressionContextId;
    this.title = title;
    this.content = content;
  }

  static create(userId: string, expressionContextId: string, title: string) {
    return new Note(
      NoteId.create(),
      NoteUserId.fromString(userId),
      NoteExpressionContextId.fromString(expressionContextId),
      NoteTitle.fromString(title),
    );
  }

  updateTitle(title: string) {
    this.title = NoteTitle.fromString(title);
  }

  updateContent(content: string) {
    this.content = content;
  }

  getNoteId() {
    return this.noteId;
  }

  getUserId() {
    return this.userId;
  }

  getExpressionContextId() {
    return this.expressionContextId;
  }

  getTitle() {
    return this.title;
  }

  getContent() {
    return this.content;
  }
}
