import { IQuery } from '@nestjs/cqrs';

export class GetSentenceByIdQuery implements IQuery {
  constructor(public readonly sentenceId: string) {}
}
