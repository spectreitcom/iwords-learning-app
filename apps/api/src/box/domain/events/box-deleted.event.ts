import { IEvent } from '@nestjs/cqrs';

export class BoxDeletedEvent implements IEvent {
  constructor(public readonly boxId: string) {}
}
