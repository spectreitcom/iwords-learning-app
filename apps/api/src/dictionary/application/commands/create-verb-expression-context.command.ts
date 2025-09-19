import { ICommand } from '@nestjs/cqrs';

export class CreateVerbExpressionContextCommand implements ICommand {
  constructor(
    public readonly expressionId: string,
    public readonly translation: string,
  ) {}
}
