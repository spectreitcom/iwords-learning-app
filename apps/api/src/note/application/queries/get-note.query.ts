import { IQuery } from '@nestjs/cqrs';

export class GetNoteQuery implements IQuery {
  constructor(
    public readonly noteId: string,
    public readonly userId: string,
  ) {}
}
