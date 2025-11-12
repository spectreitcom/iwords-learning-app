import { IQuery } from '@nestjs/cqrs';

export class GetInformationIfBoxIsFinishedByBoxIdsQuery implements IQuery {
  constructor(public readonly boxIds: string[]) {}
}
