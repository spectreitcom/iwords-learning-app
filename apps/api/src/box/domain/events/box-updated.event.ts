import { IEvent } from '@nestjs/cqrs';

export class BoxUpdatedEvent implements IEvent {
  constructor(
    public readonly boxId: string,
    public readonly title: string,
  ) {}
}
