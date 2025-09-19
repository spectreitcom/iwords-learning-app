import { ICommand } from '@nestjs/cqrs';

export class CreateAdverbExpressionContextCommand implements ICommand {
  constructor(
    public readonly expressionId: string,
    public readonly translation: string,
  ) {}
}
