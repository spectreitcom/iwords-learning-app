import { IEvent } from '@nestjs/cqrs';

export class SentenceCreatedEvent implements IEvent {
  constructor(
    public readonly sentenceId: string,
    public readonly content: string,
    public readonly translation: string,
    public readonly expressionContextId: string,
  ) {}
}
