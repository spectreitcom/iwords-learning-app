import { ICommand } from '@nestjs/cqrs';

export class UpdateNoteTitleCommand implements ICommand {
  constructor(
    public readonly noteId: string,
    public readonly userId: string,
    public readonly title: string,
  ) {}
}
