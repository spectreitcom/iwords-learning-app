import { ICommand } from '@nestjs/cqrs';

export class UpdateNounExpressionContextCommand implements ICommand {
  constructor(
    public readonly expressionContextId: string,
    public readonly translation: string,
    public readonly isCountable: boolean,
  ) {}
}
