import { ICommand } from '@nestjs/cqrs';

export class UpdateExpressionContextDefinitionCommand implements ICommand {
  constructor(
    public readonly expressionContextId: string,
    public readonly definition: string,
    public readonly definitionTranslation: string,
  ) {}
}
