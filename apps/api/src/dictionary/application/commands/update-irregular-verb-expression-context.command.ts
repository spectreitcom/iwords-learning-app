import { ICommand } from '@nestjs/cqrs';

export class UpdateIrregularVerbExpressionContextCommand implements ICommand {
  constructor(
    public readonly expressionContextId: string,
    public readonly translation: string,
    public readonly forms: [string, string, string],
  ) {}
}
