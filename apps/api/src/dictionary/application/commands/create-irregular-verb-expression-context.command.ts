import { ICommand } from '@nestjs/cqrs';

export class CreateIrregularVerbExpressionContextCommand implements ICommand {
  constructor(
    public readonly expressionId: string,
    public readonly translation: string,
    public readonly forms: [string, string, string],
  ) {}
}
