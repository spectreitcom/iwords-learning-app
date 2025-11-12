import { ICommand } from '@nestjs/cqrs';

export class MarkBoxAsFinishedCommand implements ICommand {
  constructor(
    public readonly boxId: string,
    public readonly userId: string,
  ) {}
}
