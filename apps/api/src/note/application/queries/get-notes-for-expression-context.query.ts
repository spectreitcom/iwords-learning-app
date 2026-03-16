import { IQuery } from '@nestjs/cqrs';

export class GetNotesForExpressionContextQuery implements IQuery {
  constructor(
    public readonly expressionContextId: string,
    public readonly take: number,
    public readonly page: number,
  ) {}
}
