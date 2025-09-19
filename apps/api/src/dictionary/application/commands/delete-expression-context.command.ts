import { ICommand } from '@nestjs/cqrs';

export class DeleteExpressionContextCommand implements ICommand {
  constructor(public readonly expressionContextId: string) {}
}
