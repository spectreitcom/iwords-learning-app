import { IEvent } from '@nestjs/cqrs';

export class ExpressionCreatedEvent implements IEvent {
  constructor(
    public readonly expressionId: string,
    public readonly phrase: string,
  ) {}
}
