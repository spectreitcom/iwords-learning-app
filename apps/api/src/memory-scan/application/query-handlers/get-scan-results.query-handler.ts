import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetScanResultsQuery } from '../queries/get-scan-results.query';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { ScanResultView } from '../../views/scan-result.view';

@QueryHandler(GetScanResultsQuery)
export class GetScanResultsQueryHandler implements IQueryHandler<
  GetScanResultsQuery,
  ScanResultView[]
> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetScanResultsQuery): Promise<ScanResultView[]> {
    const { userId } = query;

    const records = await this.prismaService.memoryScanResults.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map(
      (record) =>
        new ScanResultView(
          record.id,
          record.userId,
          record.itemsCount,
          record.rememberedItemsCount,
          record.rememberingTime,
          record.createdAt,
        ),
    );
  }
}
