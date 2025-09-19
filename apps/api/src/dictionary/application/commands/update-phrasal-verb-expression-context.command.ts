import { ICommand } from '@nestjs/cqrs';

export class UpdatePhrasalVerbExpressionContextCommand implements ICommand {
  constructor(
    public readonly expressionContextId: string,
    public readonly translation: string,
  ) {}
}
