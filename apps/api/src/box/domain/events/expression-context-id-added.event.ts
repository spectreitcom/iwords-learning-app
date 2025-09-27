import { IEvent } from '@nestjs/cqrs';

export class ExpressionContextIdAddedEvent implements IEvent {
  constructor(
    public readonly boxId: string,
    public readonly expressionContextId: string,
  ) {}
}
