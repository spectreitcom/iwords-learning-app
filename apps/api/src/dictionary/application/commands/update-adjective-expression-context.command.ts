import { ICommand } from '@nestjs/cqrs';

export class UpdateAdjectiveExpressionContextCommand implements ICommand {
  constructor(
    public readonly expressionContextId: string,
    public readonly translation: string,
  ) {}
}
