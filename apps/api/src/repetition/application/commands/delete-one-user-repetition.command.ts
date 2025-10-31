import { ICommand } from '@nestjs/cqrs';

export class DeleteOneUserRepetitionCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly repetitionId: string,
  ) {}
}
