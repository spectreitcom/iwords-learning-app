import { ICommand } from '@nestjs/cqrs';

export class CreateExpressionCommand implements ICommand {
  constructor(public readonly phrase: string) {}
}
