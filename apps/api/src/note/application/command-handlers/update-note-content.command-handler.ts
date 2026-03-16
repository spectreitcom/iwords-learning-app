import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateNoteContentCommand } from '../commands/update-note-content.command';
import { NoteRepository } from '../ports/note.repository';
import { AppError } from '../../../common/errors';

@CommandHandler(UpdateNoteContentCommand)
export class UpdateNoteContentCommandHandler implements ICommandHandler<
  UpdateNoteContentCommand,
  void
> {
  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly noteRepository: NoteRepository,
  ) {}

  async execute(command: UpdateNoteContentCommand): Promise<void> {
    const { noteId, userId, content } = command;

    const note = await this.noteRepository.findById(noteId);

    if (!note || note.getUserId().value !== userId) {
      throw new AppError(
        'ENTITY_NOT_FOUND',
        `Note with ID ${noteId} not found.`,
      );
    }

    note.updateContent(content);

    this.eventPublisher.mergeObjectContext(note);
    await this.noteRepository.save(note);
    note.commit();
  }
}
