import { EventPublisher } from '@nestjs/cqrs';
import { UpdateNoteContentCommandHandler } from '../update-note-content.command-handler';
import { FakeNoteRepository } from './fakes/fake-note.repository';
import { FakeEventPublisher } from '../../../../../__tests/fakes/fake-event-publisher';
import { UpdateNoteContentCommand } from '../../commands/update-note-content.command';
import { Note } from '../../../domain/note';
import { NotFoundException } from '@nestjs/common';

describe('UpdateNoteContentCommandHandler', () => {
  let eventPublisher: EventPublisher & { lastMerged?: any };
  let noteRepository: FakeNoteRepository;
  let handler: UpdateNoteContentCommandHandler;

  const userId = '123e4567-e89b-12d3-a456-426614174001';
  const expressionContextId = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(() => {
    eventPublisher = new FakeEventPublisher() as unknown as EventPublisher;
    noteRepository = new FakeNoteRepository();
    handler = new UpdateNoteContentCommandHandler(
      eventPublisher,
      noteRepository,
    );
  });

  it('should update note content', async () => {
    const note = Note.create(userId, expressionContextId, 'Initial Title');
    await noteRepository.save(note);
    const noteId = note.getNoteId().value;
    const newContent = 'Updated Content';
    const command = new UpdateNoteContentCommand(noteId, userId, newContent);

    await handler.execute(command);

    const updatedNote = await noteRepository.findById(noteId);
    expect(updatedNote?.getContent()).toBe(newContent);
    expect(eventPublisher.lastMerged).toBeTruthy();
    expect(eventPublisher.lastMerged.commit).toHaveBeenCalled();
  });

  it('should throw NotFoundException if note does not exist', async () => {
    const nonExistentId = '123e4567-e89b-12d3-a456-426614174003';
    const command = new UpdateNoteContentCommand(
      nonExistentId,
      userId,
      'Content',
    );

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if note belongs to another user', async () => {
    const otherUserId = '123e4567-e89b-12d3-a456-426614174002';
    const note = Note.create(otherUserId, expressionContextId, 'Initial Title');
    await noteRepository.save(note);
    const command = new UpdateNoteContentCommand(
      note.getNoteId().value,
      userId,
      'Content',
    );

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });
});
