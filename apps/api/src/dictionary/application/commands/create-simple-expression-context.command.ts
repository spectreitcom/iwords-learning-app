import { ICommand } from '@nestjs/cqrs';

export class CreateSimpleExpressionContextCommand implements ICommand {
  constructor(
    public readonly expressionId: string,
    public readonly translation: string,
  ) {}
}
