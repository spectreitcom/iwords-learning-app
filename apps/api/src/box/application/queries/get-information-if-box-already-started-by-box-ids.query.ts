import { IQuery } from '@nestjs/cqrs';

export class GetInformationIfBoxAlreadyStartedByBoxIdsQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly boxIds: string[],
  ) {}
}
