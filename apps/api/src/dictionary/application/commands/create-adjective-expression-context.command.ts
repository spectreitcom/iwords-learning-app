import { ICommand } from '@nestjs/cqrs';

export class CreateAdjectiveExpressionContextCommand implements ICommand {
  constructor(
    public readonly expressionId: string,
    public readonly translation: string,
  ) {}
}
