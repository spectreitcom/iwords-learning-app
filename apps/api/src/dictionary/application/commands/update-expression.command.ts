import { ICommand } from '@nestjs/cqrs';

export class UpdateExpressionCommand implements ICommand {
  constructor(
    public readonly expressionId: string,
    public readonly phrase: string,
  ) {}
}
