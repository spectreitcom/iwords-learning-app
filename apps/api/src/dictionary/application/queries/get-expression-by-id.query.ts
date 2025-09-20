import { IQuery } from '@nestjs/cqrs';

export class GetExpressionByIdQuery implements IQuery {
  constructor(public readonly expressionId: string) {}
}
