import { ICommand } from '@nestjs/cqrs';

export class AddExpressionContextIdCommand implements ICommand {
  constructor(
    public readonly boxId: string,
    public readonly expressionContextId: string,
  ) {}
}
