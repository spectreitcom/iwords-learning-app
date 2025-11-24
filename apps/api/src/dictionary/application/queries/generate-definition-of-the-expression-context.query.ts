import { IQuery } from '@nestjs/cqrs';

export class GenerateDefinitionOfTheExpressionContextQuery implements IQuery {
  constructor(public readonly expressionContextId: string) {}
}
