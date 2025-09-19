import { IEvent } from '@nestjs/cqrs';

export class ExpressionContextDeletedEvent implements IEvent {
  constructor(
    public readonly expressionContextId: string,
    public readonly expressionId: string,
  ) {}
}
