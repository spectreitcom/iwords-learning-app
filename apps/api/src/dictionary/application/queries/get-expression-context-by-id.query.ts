import { IQuery } from '@nestjs/cqrs';

export class GetExpressionContextByIdQuery implements IQuery {
  constructor(public readonly expressionContextId: string) {}
}
