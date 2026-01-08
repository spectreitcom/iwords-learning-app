import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OutboxCron {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * IMPORTANT: The cron schedule is set to run every 10 minutes, because I run server only locally.
   * On production environment, it should be set to run every day at midnight.
   */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async handle() {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    await this.prisma.outboxMessage.deleteMany({
      where: {
        createdAt: { lte: threeDaysAgo },
      },
    });
  }
}
