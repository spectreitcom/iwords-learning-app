import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Clock } from '../../common/clock/clock';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClearMemoryScanDataCron {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly clock: Clock,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handler() {
    await this.prismaService.$transaction(async (prisma) => {
      await this.removeMemoryScanLearnedItemOlderThan7days(prisma);
      await this.removeMemoryScanResultsOlderThan30days(prisma);
    });
  }

  private async removeMemoryScanLearnedItemOlderThan7days(
    tx: Prisma.TransactionClient,
  ) {
    const sevenDaysAgo = this.clock.subtractDaysFromNow(7);

    await tx.memoryScanLearnedItems.deleteMany({
      where: {
        createdAt: {
          lte: sevenDaysAgo,
        },
      },
    });
  }

  private async removeMemoryScanResultsOlderThan30days(
    tx: Prisma.TransactionClient,
  ) {
    const thirtyDaysAgo = this.clock.subtractDaysFromNow(30);

    await tx.memoryScanResults.deleteMany({
      where: {
        createdAt: {
          lte: thirtyDaysAgo,
        },
      },
    });
  }
}
