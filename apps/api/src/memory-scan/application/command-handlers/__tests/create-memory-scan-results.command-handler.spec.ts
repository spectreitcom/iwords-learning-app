import { randomUUID } from 'node:crypto';
import { CreateMemoryScanResultsCommandHandler } from '../create-memory-scan-results.command-handler';
import { CreateMemoryScanResultsCommand } from '../../commmands/create-memory-scan-results.command';
import { PrismaService } from '../../../../common/prisma/prisma.service';
import { FakeClock } from '../../../../repetition/application/command-handlers/__tests/fakes/fake-clock';

describe('CreateMemoryScanResultsCommandHandler', () => {
  it('should create memory scan results with today count of learned items', async () => {
    const USER_ID = randomUUID();
    const RESULT_ID = randomUUID();
    const REMEMBERED_ITEMS_COUNT = 8;
    const REMEMBERING_TIME = 120;
    const TODAY = new Date('2026-09-22T00:00:00.000Z');
    const ITEMS_COUNT = 15;

    const clock = new FakeClock(TODAY);

    const prismaServiceMock = {
      memoryScanLearnedItems: {
        count: jest.fn().mockResolvedValue(ITEMS_COUNT),
      },
      memoryScanResults: {
        create: jest.fn().mockResolvedValue({ id: RESULT_ID }),
      },
    } as unknown as PrismaService;

    const handler = new CreateMemoryScanResultsCommandHandler(
      prismaServiceMock,
      clock,
    );

    const result = await handler.execute(
      new CreateMemoryScanResultsCommand(
        USER_ID,
        REMEMBERED_ITEMS_COUNT,
        REMEMBERING_TIME,
      ),
    );

    expect(result).toBe(RESULT_ID);
    expect(
      prismaServiceMock.memoryScanLearnedItems.count,
    ).toHaveBeenCalledTimes(1);
    expect(prismaServiceMock.memoryScanLearnedItems.count).toHaveBeenCalledWith(
      {
        where: {
          userId: USER_ID,
          createdAt: clock.today(),
        },
      },
    );
    expect(prismaServiceMock.memoryScanResults.create).toHaveBeenCalledTimes(1);
    expect(prismaServiceMock.memoryScanResults.create).toHaveBeenCalledWith({
      data: {
        userId: USER_ID,
        itemsCount: ITEMS_COUNT,
        rememberedItemsCount: REMEMBERED_ITEMS_COUNT,
        rememberingTime: REMEMBERING_TIME,
      },
    });
  });

  it('should handle 0 learned items for today correctly', async () => {
    const USER_ID = randomUUID();
    const RESULT_ID = randomUUID();
    const REMEMBERED_ITEMS_COUNT = 0;
    const REMEMBERING_TIME = 60;
    const TODAY = new Date('2026-09-22T00:00:00.000Z');

    const clock = new FakeClock(TODAY);

    const prismaServiceMock = {
      memoryScanLearnedItems: {
        count: jest.fn().mockResolvedValue(0),
      },
      memoryScanResults: {
        create: jest.fn().mockResolvedValue({ id: RESULT_ID }),
      },
    } as unknown as PrismaService;

    const handler = new CreateMemoryScanResultsCommandHandler(
      prismaServiceMock,
      clock,
    );

    const result = await handler.execute(
      new CreateMemoryScanResultsCommand(
        USER_ID,
        REMEMBERED_ITEMS_COUNT,
        REMEMBERING_TIME,
      ),
    );

    expect(result).toBe(RESULT_ID);
    expect(prismaServiceMock.memoryScanLearnedItems.count).toHaveBeenCalledWith(
      {
        where: {
          userId: USER_ID,
          createdAt: clock.today(),
        },
      },
    );
    expect(prismaServiceMock.memoryScanResults.create).toHaveBeenCalledWith({
      data: {
        userId: USER_ID,
        itemsCount: 0,
        rememberedItemsCount: REMEMBERED_ITEMS_COUNT,
        rememberingTime: REMEMBERING_TIME,
      },
    });
  });
});
