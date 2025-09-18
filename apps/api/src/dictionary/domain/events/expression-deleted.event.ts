import { IEvent } from '@nestjs/cqrs';

export class ExpressionDeletedEvent implements IEvent {
  constructor(public readonly expressionId: string) {}
}
