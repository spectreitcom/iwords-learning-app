import { ICommand } from '@nestjs/cqrs';

export class AddExpressionContextToRepetitionCommand implements ICommand {
  constructor(
    public readonly expressionContextId: string,
    public readonly userId: string,
  ) {}
}
