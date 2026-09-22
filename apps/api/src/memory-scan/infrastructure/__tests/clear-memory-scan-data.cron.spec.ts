import { ClearMemoryScanDataCron } from '../clear-memory-scan-data.cron';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { FakeClock } from '../../../repetition/application/command-handlers/__tests/fakes/fake-clock';

describe('ClearMemoryScanDataCron', () => {
  it('should remove learned items older than 7 days and results older than 30 days', async () => {
    const fixedDate = new Date('2026-09-22T02:00:00.000Z');
    const clock = new FakeClock(fixedDate);

    const prismaServiceMock = {
      memoryScanLearnedItems: {
        deleteMany: jest.fn().mockResolvedValue({ count: 5 }),
      },
      memoryScanResults: {
        deleteMany: jest.fn().mockResolvedValue({ count: 2 }),
      },
    } as unknown as PrismaService;

    const cron = new ClearMemoryScanDataCron(prismaServiceMock, clock);

    await cron.handler();

    const expected7DaysAgo = clock.subtractDaysFromNow(7);
    const expected30DaysAgo = clock.subtractDaysFromNow(30);

    expect(
      prismaServiceMock.memoryScanLearnedItems.deleteMany,
    ).toHaveBeenCalledTimes(1);
    expect(
      prismaServiceMock.memoryScanLearnedItems.deleteMany,
    ).toHaveBeenCalledWith({
      where: {
        createdAt: {
          lte: expected7DaysAgo,
        },
      },
    });

    expect(
      prismaServiceMock.memoryScanResults.deleteMany,
    ).toHaveBeenCalledTimes(1);
    expect(prismaServiceMock.memoryScanResults.deleteMany).toHaveBeenCalledWith(
      {
        where: {
          createdAt: {
            lte: expected30DaysAgo,
          },
        },
      },
    );
  });
});
