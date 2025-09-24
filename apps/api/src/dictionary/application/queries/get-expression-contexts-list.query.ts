import { IQuery } from '@nestjs/cqrs';

export class GetExpressionContextsListQuery implements IQuery {
  constructor(
    public readonly expressionId: string,
    public readonly take: number,
    public readonly page: number,
  ) {}
}
