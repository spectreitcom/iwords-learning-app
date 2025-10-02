import { ICommand } from '@nestjs/cqrs';

export class RemoveExpressionContextIdCommand implements ICommand {
  constructor(
    public readonly boxId: string,
    public readonly expressionContextId: string,
  ) {}
}
