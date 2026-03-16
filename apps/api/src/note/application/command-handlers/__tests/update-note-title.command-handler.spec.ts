import { EventPublisher } from '@nestjs/cqrs';
import { UpdateNoteTitleCommandHandler } from '../update-note-title.command-handler';
import { FakeNoteRepository } from './fakes/fake-note.repository';
import { FakeEventPublisher } from '../../../../../__tests/fakes/fake-event-publisher';
import { UpdateNoteTitleCommand } from '../../commands/update-note-title.command';
import { Note } from '../../../domain/note';
import { NotFoundException } from '@nestjs/common';

describe('UpdateNoteTitleCommandHandler', () => {
  let eventPublisher: EventPublisher & { lastMerged?: any };
  let noteRepository: FakeNoteRepository;
  let handler: UpdateNoteTitleCommandHandler;

  const userId = '123e4567-e89b-12d3-a456-426614174001';
  const expressionContextId = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(() => {
    eventPublisher = new FakeEventPublisher() as unknown as EventPublisher;
    noteRepository = new FakeNoteRepository();
    handler = new UpdateNoteTitleCommandHandler(eventPublisher, noteRepository);
  });

  it('should update note title', async () => {
    const note = Note.create(userId, expressionContextId, 'Initial Title');
    await noteRepository.save(note);
    const noteId = note.getNoteId().value;
    const newTitle = 'Updated Title';
    const command = new UpdateNoteTitleCommand(noteId, userId, newTitle);

    await handler.execute(command);

    const updatedNote = await noteRepository.findById(noteId);
    expect(updatedNote?.getTitle().value).toBe(newTitle);
    expect(eventPublisher.lastMerged).toBeTruthy();
    expect(eventPublisher.lastMerged.commit).toHaveBeenCalled();
  });

  it('should throw NotFoundException if note does not exist', async () => {
    const nonExistentId = '123e4567-e89b-12d3-a456-426614174003';
    const command = new UpdateNoteTitleCommand(nonExistentId, userId, 'Title');

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if note belongs to another user', async () => {
    const otherUserId = '123e4567-e89b-12d3-a456-426614174002';
    const note = Note.create(otherUserId, expressionContextId, 'Initial Title');
    await noteRepository.save(note);
    const command = new UpdateNoteTitleCommand(
      note.getNoteId().value,
      userId,
      'Title',
    );

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });
});
