import { IQuery } from '@nestjs/cqrs';

export class GetScanResultsQuery implements IQuery {
  constructor(public readonly userId: string) {}
}
