import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBoxIdsForCurrentRepetitionQuery } from '../queries/get-box-ids-for-current-repetition.query';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { GenerateRepetitionService } from '../ports/generate-repetition.service';
import { Clock } from '../../../common/clock/clock';

@QueryHandler(GetBoxIdsForCurrentRepetitionQuery)
export class GetBoxIdsForCurrentRepetitionQueryHandler
  implements IQueryHandler<GetBoxIdsForCurrentRepetitionQuery, string[]>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly generateRepetitionService: GenerateRepetitionService,
    private readonly clock: Clock,
  ) {}

  async execute(query: GetBoxIdsForCurrentRepetitionQuery): Promise<string[]> {
    const { userId } = query;

    const record = await this.prismaService.boxDailyRepetition.findUnique({
      where: { userId, updatedAt: this.clock.now() },
    });

    if (record) return record.boxIds;

    return await this.generateRepetitionService.generate(userId);
  }
}
