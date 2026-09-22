import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateMemoryScanResultsCommand } from './commmands/create-memory-scan-results.command';
import { GetLearnedItemsForTodayQuery } from './queries/get-learned-items-for-today.query';
import { GetScanResultsQuery } from './queries/get-scan-results.query';
import { LearnedItemForTodayView } from '../views/learned-item-for-today.view';
import { ScanResultView } from '../views/scan-result.view';

@Injectable()
export class MemoryScanApiService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createMemoryScanResult(
    userId: string,
    rememberedItemsCount: number,
    rememberingTime: number,
  ): Promise<string> {
    return await this.commandBus.execute<
      CreateMemoryScanResultsCommand,
      string
    >(
      new CreateMemoryScanResultsCommand(
        userId,
        rememberedItemsCount,
        rememberingTime,
      ),
    );
  }

  async getLearnedItemsForToday(
    userId: string,
  ): Promise<LearnedItemForTodayView[]> {
    return await this.queryBus.execute<
      GetLearnedItemsForTodayQuery,
      LearnedItemForTodayView[]
    >(new GetLearnedItemsForTodayQuery(userId));
  }

  async getScanResults(userId: string): Promise<ScanResultView[]> {
    return await this.queryBus.execute<GetScanResultsQuery, ScanResultView[]>(
      new GetScanResultsQuery(userId),
    );
  }
}
