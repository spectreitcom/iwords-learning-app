import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { DeleteNoteCommand } from '../commands/delete-note.command';
import { NoteRepository } from '../ports/note.repository';
import { AppError } from '../../../common/errors';

@CommandHandler(DeleteNoteCommand)
export class DeleteNoteCommandHandler implements ICommandHandler<
  DeleteNoteCommand,
  void
> {
  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly noteRepository: NoteRepository,
  ) {}

  async execute(command: DeleteNoteCommand): Promise<void> {
    const { noteId, userId } = command;

    const note = await this.noteRepository.findById(noteId);

    if (!note || note.getUserId().value !== userId) {
      throw new AppError(
        'ENTITY_NOT_FOUND',
        `Note with ID ${noteId} not found.`,
      );
    }

    this.eventPublisher.mergeObjectContext(note);
    await this.noteRepository.delete(noteId);
    note.commit();
  }
}
