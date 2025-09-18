import { ICommand } from '@nestjs/cqrs';

export class DeleteExpressionCommand implements ICommand {
  constructor(public readonly expressionId: string) {}
}
