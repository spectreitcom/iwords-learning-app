import { EventPublisher } from '@nestjs/cqrs';
import { DeleteNoteCommandHandler } from '../delete-note.command-handler';
import { FakeNoteRepository } from './fakes/fake-note.repository';
import { FakeEventPublisher } from '../../../../../__tests/fakes/fake-event-publisher';
import { DeleteNoteCommand } from '../../commands/delete-note.command';
import { Note } from '../../../domain/note';
import { NoteId } from '../../../domain/value-objects/note-id';
import { NoteUserId } from '../../../domain/value-objects/note-user-id';
import { NoteExpressionContextId } from '../../../domain/value-objects/note-expression-context-id';
import { NoteTitle } from '../../../domain/value-objects/note-title';
import { AppError } from '../../../../common/errors';

describe('DeleteNoteCommandHandler', () => {
  let eventPublisher: EventPublisher & { lastMerged?: any };
  let noteRepository: FakeNoteRepository;
  let handler: DeleteNoteCommandHandler;

  const noteId = '123e4567-e89b-12d3-a456-426614174000';
  const userId = '123e4567-e89b-12d3-a456-426614174001';
  const expressionContextId = '123e4567-e89b-12d3-a456-426614174002';

  beforeEach(() => {
    eventPublisher = new FakeEventPublisher() as unknown as EventPublisher;
    noteRepository = new FakeNoteRepository();
    handler = new DeleteNoteCommandHandler(eventPublisher, noteRepository);
  });

  it('should delete a note', async () => {
    const note = new Note(
      NoteId.fromString(noteId),
      NoteUserId.fromString(userId),
      NoteExpressionContextId.fromString(expressionContextId),
      NoteTitle.fromString('Title'),
    );
    await noteRepository.save(note);
    expect(noteRepository.getLength()).toBe(1);

    const command = new DeleteNoteCommand(noteId, userId);
    await handler.execute(command);

    expect(noteRepository.getLength()).toBe(0);
    expect(eventPublisher.lastMerged).toBeTruthy();
    expect(eventPublisher.lastMerged.commit).toHaveBeenCalled();
  });

  it('should throw ENTITY_NOT_FOUND if note does not exist', async () => {
    const command = new DeleteNoteCommand(noteId, userId);

    await expect(handler.execute(command)).rejects.toThrow(AppError);
    await expect(handler.execute(command)).rejects.toMatchObject({
      code: 'ENTITY_NOT_FOUND',
    });
  });

  it('should throw ENTITY_NOT_FOUND if user is not the owner', async () => {
    const note = new Note(
      NoteId.fromString(noteId),
      NoteUserId.fromString(userId),
      NoteExpressionContextId.fromString(expressionContextId),
      NoteTitle.fromString('Title'),
    );
    await noteRepository.save(note);

    const command = new DeleteNoteCommand(noteId, 'another-user-id');

    await expect(handler.execute(command)).rejects.toThrow(AppError);
    await expect(handler.execute(command)).rejects.toMatchObject({
      code: 'ENTITY_NOT_FOUND',
    });
  });
});
