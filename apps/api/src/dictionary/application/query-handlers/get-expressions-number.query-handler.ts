import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetExpressionsNumberQuery } from '../queries/get-expressions-number.query';
import { PrismaService } from '../../../common/prisma/prisma.service';

@QueryHandler(GetExpressionsNumberQuery)
export class GetExpressionsNumberQueryHandler
  implements IQueryHandler<GetExpressionsNumberQuery, number>
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(): Promise<number> {
    return this.prismaService.expression.count();
  }
}
