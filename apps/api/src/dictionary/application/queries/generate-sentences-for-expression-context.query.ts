import { IQuery } from '@nestjs/cqrs';

export class GenerateSentencesForExpressionContextQuery implements IQuery {
  constructor(public readonly expressionContextId: string) {}
}
