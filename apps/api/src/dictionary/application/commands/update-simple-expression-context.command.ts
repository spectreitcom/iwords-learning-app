import { ICommand } from '@nestjs/cqrs';

export class UpdateSimpleExpressionContextCommand implements ICommand {
  constructor(
    public readonly expressionContextId: string,
    public readonly translation: string,
  ) {}
}
