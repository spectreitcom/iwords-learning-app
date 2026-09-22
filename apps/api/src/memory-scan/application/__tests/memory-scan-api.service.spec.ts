import { randomUUID } from 'node:crypto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MemoryScanApiService } from '../memory-scan-api.service';
import { CreateMemoryScanResultsCommand } from '../commmands/create-memory-scan-results.command';
import { GetLearnedItemsForTodayQuery } from '../queries/get-learned-items-for-today.query';
import { GetScanResultsQuery } from '../queries/get-scan-results.query';
import { LearnedItemForTodayView } from '../../views/learned-item-for-today.view';
import { ScanResultView } from '../../views/scan-result.view';

describe('MemoryScanApiService', () => {
  let service: MemoryScanApiService;
  let commandBusMock: jest.Mocked<CommandBus>;
  let queryBusMock: jest.Mocked<QueryBus>;

  beforeEach(() => {
    commandBusMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CommandBus>;

    queryBusMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBus>;

    service = new MemoryScanApiService(commandBusMock, queryBusMock);
  });

  describe('createMemoryScanResult', () => {
    it('should execute CreateMemoryScanResultsCommand and return result id', async () => {
      const USER_ID = randomUUID();
      const REMEMBERED_ITEMS_COUNT = 5;
      const REMEMBERING_TIME = 90;
      const RESULT_ID = randomUUID();

      commandBusMock.execute.mockResolvedValue(RESULT_ID);

      const result = await service.createMemoryScanResult(
        USER_ID,
        REMEMBERED_ITEMS_COUNT,
        REMEMBERING_TIME,
      );

      expect(commandBusMock.execute).toHaveBeenCalledTimes(1);
      expect(commandBusMock.execute).toHaveBeenCalledWith(
        new CreateMemoryScanResultsCommand(
          USER_ID,
          REMEMBERED_ITEMS_COUNT,
          REMEMBERING_TIME,
        ),
      );
      expect(result).toBe(RESULT_ID);
    });
  });

  describe('getLearnedItemsForToday', () => {
    it('should execute GetLearnedItemsForTodayQuery and return learned items', async () => {
      const USER_ID = randomUUID();
      const LEARNED_ITEMS: LearnedItemForTodayView[] = [
        new LearnedItemForTodayView(
          randomUUID(),
          USER_ID,
          randomUUID(),
          randomUUID(),
          new Date(),
        ),
      ];

      queryBusMock.execute.mockResolvedValue(LEARNED_ITEMS);

      const result = await service.getLearnedItemsForToday(USER_ID);

      expect(queryBusMock.execute).toHaveBeenCalledTimes(1);
      expect(queryBusMock.execute).toHaveBeenCalledWith(
        new GetLearnedItemsForTodayQuery(USER_ID),
      );
      expect(result).toBe(LEARNED_ITEMS);
    });
  });

  describe('getScanResults', () => {
    it('should execute GetScanResultsQuery and return scan results', async () => {
      const USER_ID = randomUUID();
      const SCAN_RESULTS: ScanResultView[] = [
        new ScanResultView(randomUUID(), USER_ID, 10, 8, 120, new Date()),
      ];

      queryBusMock.execute.mockResolvedValue(SCAN_RESULTS);

      const result = await service.getScanResults(USER_ID);

      expect(queryBusMock.execute).toHaveBeenCalledTimes(1);
      expect(queryBusMock.execute).toHaveBeenCalledWith(
        new GetScanResultsQuery(USER_ID),
      );
      expect(result).toBe(SCAN_RESULTS);
    });
  });
});
