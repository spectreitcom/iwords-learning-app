import { ICommand } from '@nestjs/cqrs';

export class CreateNoteCommand implements ICommand {
  constructor(
    public readonly expressionContextId: string,
    public readonly userId: string,
    public readonly title: string,
  ) {}
}
