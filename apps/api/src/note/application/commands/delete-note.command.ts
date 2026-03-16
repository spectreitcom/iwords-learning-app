import { ICommand } from '@nestjs/cqrs';

export class DeleteNoteCommand implements ICommand {
  constructor(
    public readonly noteId: string,
    public readonly userId: string,
  ) {}
}
