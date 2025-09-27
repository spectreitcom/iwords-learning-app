import { IEvent } from '@nestjs/cqrs';

export class BoxCreatedEvent implements IEvent {
  constructor(
    public readonly boxId: string,
    public readonly title: string,
    public readonly expressionContextIds: string[],
  ) {}
}
