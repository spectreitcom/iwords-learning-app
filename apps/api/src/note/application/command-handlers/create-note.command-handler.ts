import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateNoteCommand } from '../commands/create-note.command';
import { NoteRepository } from '../ports/note.repository';
import { Note } from '../../domain/note';

export type CreateNoteCommandResponse = {
  noteId: string;
};

@CommandHandler(CreateNoteCommand)
export class CreateNoteCommandHandler implements ICommandHandler<
  CreateNoteCommand,
  CreateNoteCommandResponse
> {
  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly noteRepository: NoteRepository,
  ) {}

  async execute(
    command: CreateNoteCommand,
  ): Promise<CreateNoteCommandResponse> {
    const { userId, expressionContextId, title } = command;

    const note = Note.create(userId, expressionContextId, title);

    this.eventPublisher.mergeObjectContext(note);
    await this.noteRepository.save(note);
    note.commit();

    return {
      noteId: note.getNoteId().value,
    };
  }
}
