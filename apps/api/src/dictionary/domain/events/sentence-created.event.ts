import { IEvent } from '@nestjs/cqrs';

export class SentenceCreatedEvent implements IEvent {
  constructor(
    public readonly sentenceId: string,
    private readonly content: string,
    private readonly translation: string,
    private readonly expressionContextId: string,
  ) {}
}
