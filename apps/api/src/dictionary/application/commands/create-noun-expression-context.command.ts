import { ICommand } from '@nestjs/cqrs';

export class CreateNounExpressionContextCommand implements ICommand {
  constructor(
    public readonly expressionId: string,
    public readonly translation: string,
    public readonly isCountable: boolean,
  ) {}
}
