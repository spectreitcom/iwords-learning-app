import { IQuery } from '@nestjs/cqrs';

export class GetSentencesByExpressionContextIdsQuery implements IQuery {
  constructor(public readonly expressionContextIds: string[]) {}
}
