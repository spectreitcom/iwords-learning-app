import { IQuery } from '@nestjs/cqrs';

export class GetUserByClerkIdQuery implements IQuery {
  constructor(public readonly clerkId: string) {}
}
