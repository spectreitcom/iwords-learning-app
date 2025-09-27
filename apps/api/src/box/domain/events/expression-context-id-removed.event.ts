import { IEvent } from '@nestjs/cqrs';

export class ExpressionContextIdRemovedEvent implements IEvent {
  constructor(
    public readonly boxId: string,
    public readonly expressionContextId: string,
  ) {}
}
