import { IQuery } from '@nestjs/cqrs';

export class GetDictionaryReadModelsByExpressionContextIdsQuery
  implements IQuery
{
  constructor(public readonly expressionContextIds: string[]) {}
}
