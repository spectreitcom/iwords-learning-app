import { ICommand } from '@nestjs/cqrs';

export class UpdateVerbExpressionContextCommand implements ICommand {
  constructor(
    public readonly expressionContextId: string,
    public readonly translation: string,
  ) {}
}
