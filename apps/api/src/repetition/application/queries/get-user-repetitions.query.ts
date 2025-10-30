import { IQuery } from '@nestjs/cqrs';

export class GetUserRepetitionsQuery implements IQuery {
  constructor(public readonly userId: string) {}
}
