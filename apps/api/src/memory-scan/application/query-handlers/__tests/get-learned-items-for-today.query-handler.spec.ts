import { randomUUID } from 'node:crypto';
import { GetLearnedItemsForTodayQueryHandler } from '../get-learned-items-for-today.query-handler';
import { GetLearnedItemsForTodayQuery } from '../../queries/get-learned-items-for-today.query';
import { PrismaService } from '../../../../common/prisma/prisma.service';
import { FakeClock } from '../../../../repetition/application/command-handlers/__tests/fakes/fake-clock';
import { LearnedItemForTodayView } from '../../../views/learned-item-for-today.view';

describe('GetLearnedItemsForTodayQueryHandler', () => {
  it('should return learned items for today for the given user', async () => {
    const USER_ID = randomUUID();
    const TODAY = new Date('2026-09-22T00:00:00.000Z');
    const clock = new FakeClock(TODAY);

    const ITEM_1 = {
      id: randomUUID(),
      userId: USER_ID,
      expressionContextId: randomUUID(),
      expressionId: randomUUID(),
      createdAt: TODAY,
    };
    const ITEM_2 = {
      id: randomUUID(),
      userId: USER_ID,
      expressionContextId: randomUUID(),
      expressionId: randomUUID(),
      createdAt: TODAY,
    };

    const prismaServiceMock = {
      memoryScanLearnedItems: {
        findMany: jest.fn().mockResolvedValue([ITEM_1, ITEM_2]),
      },
    } as unknown as PrismaService;

    const handler = new GetLearnedItemsForTodayQueryHandler(
      prismaServiceMock,
      clock,
    );

    const result = await handler.execute(
      new GetLearnedItemsForTodayQuery(USER_ID),
    );

    expect(
      prismaServiceMock.memoryScanLearnedItems.findMany,
    ).toHaveBeenCalledTimes(1);
    expect(
      prismaServiceMock.memoryScanLearnedItems.findMany,
    ).toHaveBeenCalledWith({
      where: {
        userId: USER_ID,
        createdAt: clock.today(),
      },
    });
    expect(result).toEqual([
      new LearnedItemForTodayView(
        ITEM_1.id,
        ITEM_1.userId,
        ITEM_1.expressionContextId,
        ITEM_1.expressionId,
        ITEM_1.createdAt,
      ),
      new LearnedItemForTodayView(
        ITEM_2.id,
        ITEM_2.userId,
        ITEM_2.expressionContextId,
        ITEM_2.expressionId,
        ITEM_2.createdAt,
      ),
    ]);
  });

  it('should return an empty array if no learned items found for today', async () => {
    const USER_ID = randomUUID();
    const TODAY = new Date('2026-09-22T00:00:00.000Z');
    const clock = new FakeClock(TODAY);

    const prismaServiceMock = {
      memoryScanLearnedItems: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    } as unknown as PrismaService;

    const handler = new GetLearnedItemsForTodayQueryHandler(
      prismaServiceMock,
      clock,
    );

    const result = await handler.execute(
      new GetLearnedItemsForTodayQuery(USER_ID),
    );

    expect(
      prismaServiceMock.memoryScanLearnedItems.findMany,
    ).toHaveBeenCalledWith({
      where: {
        userId: USER_ID,
        createdAt: clock.today(),
      },
    });
    expect(result).toEqual([]);
  });
});
