import { ICommand } from '@nestjs/cqrs';

export class UpdateAdverbExpressionContextCommand implements ICommand {
  constructor(
    public readonly expressionContextId: string,
    public readonly translation: string,
  ) {}
}
