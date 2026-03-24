import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBoxesNumberQuery } from '../queries/get-boxes-number.query';
import { PrismaService } from '../../../common/prisma/prisma.service';

@QueryHandler(GetBoxesNumberQuery)
export class GetBoxesNumberQueryHandler implements IQueryHandler<
  GetBoxesNumberQuery,
  number
> {
  constructor(private readonly prismaService: PrismaService) {}

  execute(): Promise<number> {
    return this.prismaService.box.count();
  }
}
