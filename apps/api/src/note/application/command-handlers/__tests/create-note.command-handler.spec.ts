import { EventPublisher } from '@nestjs/cqrs';
import { CreateNoteCommandHandler } from '../create-note.command-handler';
import { FakeNoteRepository } from './fakes/fake-note.repository';
import { FakeEventPublisher } from '../../../../../__tests/fakes/fake-event-publisher';
import { CreateNoteCommand } from '../../commands/create-note.command';

describe('CreateNoteCommandHandler', () => {
  let eventPublisher: EventPublisher & { lastMerged?: any };
  let noteRepository: FakeNoteRepository;
  let handler: CreateNoteCommandHandler;

  beforeEach(() => {
    eventPublisher = new FakeEventPublisher() as unknown as EventPublisher;
    noteRepository = new FakeNoteRepository();
    handler = new CreateNoteCommandHandler(eventPublisher, noteRepository);
  });

  it('should create a note', async () => {
    const expressionContextId = '123e4567-e89b-12d3-a456-426614174000';
    const userId = '123e4567-e89b-12d3-a456-426614174001';
    const title = 'Test Note Title';
    const command = new CreateNoteCommand(expressionContextId, userId, title);

    const result = await handler.execute(command);

    expect(result.noteId).toBeTruthy();
    expect(noteRepository.getLength()).toBe(1);
    expect(eventPublisher.lastMerged).toBeTruthy();
    expect(eventPublisher.lastMerged.commit).toHaveBeenCalled();

    const createdNote = await noteRepository.findById(result.noteId);
    expect(createdNote).toBeTruthy();
    expect(createdNote?.getUserId().value).toBe(userId);
    expect(createdNote?.getExpressionContextId().value).toBe(
      expressionContextId,
    );
    expect(createdNote?.getTitle().value).toBe(title);
  });
});
