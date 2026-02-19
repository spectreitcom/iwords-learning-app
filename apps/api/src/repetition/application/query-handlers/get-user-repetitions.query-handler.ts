import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserRepetitionsQuery } from '../queries/get-user-repetitions.query';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { RepetitionView } from '../../views/repetition.view';
import { Clock } from '../../../common/clock/clock';

@QueryHandler(GetUserRepetitionsQuery)
export class GetUserRepetitionsQueryHandler implements IQueryHandler<
  GetUserRepetitionsQuery,
  RepetitionView[]
> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly clock: Clock,
  ) {}

  async execute(query: GetUserRepetitionsQuery): Promise<RepetitionView[]> {
    const { userId } = query;

    const repetitions = await this.prismaService.repetition.findMany({
      where: { userId, nextRepetition: { lte: this.clock.now() } },
      orderBy: { nextRepetition: 'asc' },
      take: 10,
      select: { expressionContextId: true, id: true },
    });

    return repetitions.map((r) => ({
      repetitionId: r.id,
      expressionContextId: r.expressionContextId,
    }));
  }
}
