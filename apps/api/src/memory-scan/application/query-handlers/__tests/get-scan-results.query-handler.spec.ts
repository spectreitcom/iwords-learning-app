import { randomUUID } from 'node:crypto';
import { GetScanResultsQueryHandler } from '../get-scan-results.query-handler';
import { GetScanResultsQuery } from '../../queries/get-scan-results.query';
import { PrismaService } from '../../../../common/prisma/prisma.service';
import { ScanResultView } from '../../../views/scan-result.view';

describe('GetScanResultsQueryHandler', () => {
  it('should return scan results for the given user ordered by createdAt desc', async () => {
    const USER_ID = randomUUID();
    const RESULT_1 = {
      id: randomUUID(),
      userId: USER_ID,
      itemsCount: 10,
      rememberedItemsCount: 8,
      rememberingTime: 120,
      createdAt: new Date('2026-09-22T10:00:00.000Z'),
    };
    const RESULT_2 = {
      id: randomUUID(),
      userId: USER_ID,
      itemsCount: 15,
      rememberedItemsCount: 12,
      rememberingTime: 180,
      createdAt: new Date('2026-09-21T10:00:00.000Z'),
    };

    const prismaServiceMock = {
      memoryScanResults: {
        findMany: jest.fn().mockResolvedValue([RESULT_1, RESULT_2]),
      },
    } as unknown as PrismaService;

    const handler = new GetScanResultsQueryHandler(prismaServiceMock);

    const result = await handler.execute(new GetScanResultsQuery(USER_ID));

    expect(prismaServiceMock.memoryScanResults.findMany).toHaveBeenCalledTimes(
      1,
    );
    expect(prismaServiceMock.memoryScanResults.findMany).toHaveBeenCalledWith({
      where: {
        userId: USER_ID,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    expect(result).toEqual([
      new ScanResultView(
        RESULT_1.id,
        RESULT_1.userId,
        RESULT_1.itemsCount,
        RESULT_1.rememberedItemsCount,
        RESULT_1.rememberingTime,
        RESULT_1.createdAt,
      ),
      new ScanResultView(
        RESULT_2.id,
        RESULT_2.userId,
        RESULT_2.itemsCount,
        RESULT_2.rememberedItemsCount,
        RESULT_2.rememberingTime,
        RESULT_2.createdAt,
      ),
    ]);
  });

  it('should return an empty array if no scan results are found', async () => {
    const USER_ID = randomUUID();

    const prismaServiceMock = {
      memoryScanResults: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    } as unknown as PrismaService;

    const handler = new GetScanResultsQueryHandler(prismaServiceMock);

    const result = await handler.execute(new GetScanResultsQuery(USER_ID));

    expect(prismaServiceMock.memoryScanResults.findMany).toHaveBeenCalledWith({
      where: {
        userId: USER_ID,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    expect(result).toEqual([]);
  });
});
