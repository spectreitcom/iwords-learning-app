import { ICommand } from '@nestjs/cqrs';

export class UpdateNoteContentCommand implements ICommand {
  constructor(
    public readonly noteId: string,
    public readonly userId: string,
    public readonly content: string,
  ) {}
}
