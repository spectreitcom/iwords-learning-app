import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateNoteTitleCommand } from '../commands/update-note-title.command';
import { NoteRepository } from '../ports/note.repository';
import { AppError } from '../../../common/errors';

@CommandHandler(UpdateNoteTitleCommand)
export class UpdateNoteTitleCommandHandler implements ICommandHandler<
  UpdateNoteTitleCommand,
  void
> {
  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly noteRepository: NoteRepository,
  ) {}

  async execute(command: UpdateNoteTitleCommand): Promise<void> {
    const { noteId, userId, title } = command;

    const note = await this.noteRepository.findById(noteId);

    if (!note || note.getUserId().value !== userId) {
      throw new AppError(
        'ENTITY_NOT_FOUND',
        `Note with ID ${noteId} not found.`,
      );
    }

    note.updateTitle(title);

    this.eventPublisher.mergeObjectContext(note);
    await this.noteRepository.save(note);
    note.commit();
  }
}
