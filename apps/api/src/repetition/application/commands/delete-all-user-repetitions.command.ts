import { ICommand } from '@nestjs/cqrs';

export class DeleteAllUserRepetitionsCommand implements ICommand {
  constructor(public readonly userId: string) {}
}
