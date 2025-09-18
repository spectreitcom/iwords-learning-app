import { IEvent } from '@nestjs/cqrs';

export class ExpressionPhraseUpdatedEvent implements IEvent {
  constructor(
    public readonly expressionId: string,
    public readonly oldPhrase: string,
    public readonly newPhrase: string,
  ) {}
}
