import { IEvent } from '@nestjs/cqrs';

export class SentenceDeletedEvent implements IEvent {
  constructor(
    public readonly sentenceId: string,
    public readonly expressionContextId: string,
  ) {}
}
