import { ICommand } from '@nestjs/cqrs';

export class CreatePhrasalVerbExpressionContextCommand implements ICommand {
  constructor(
    public readonly expressionId: string,
    public readonly translation: string,
  ) {}
}
