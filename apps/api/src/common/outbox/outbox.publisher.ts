import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventBus } from '@nestjs/cqrs';
import { PrismaService } from '../prisma/prisma.service';
import { IntegrationEvent, IntegrationEventType } from './types';
import { Clock } from '../clock/clock';

@Injectable()
export class OutboxPublisher {
  constructor(
    private readonly eventBus: EventBus,
    private readonly prisma: PrismaService,
    private readonly clock: Clock,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handler() {
    const batch = await this.prisma.outboxMessage.findMany({
      where: {
        status: 'PENDING',
        nextAttemptAt: { lte: this.clock.now() },
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 100,
    });

    for (const msg of batch) {
      try {
        this.eventBus.publish(
          new IntegrationEvent(
            msg.eventName as IntegrationEventType,
            msg.payload,
            {
              aggregateId: msg.aggregateId,
            },
          ),
        );
        await this.prisma.outboxMessage.update({
          where: {
            id: msg.id,
          },
          data: {
            status: 'PUBLISHED',
          },
        });
      } catch {
        const attempts = msg.attempts + 1;
        const backoff = Math.min(60 * 30, 2 ** attempts);
        await this.prisma.outboxMessage.update({
          where: {
            id: msg.id,
          },
          data: {
            attempts,
            nextAttemptAt: this.clock.addMillisecondsFromNow(backoff),
            status: attempts >= 10 ? 'FAILED' : 'PENDING',
          },
        });
      }
    }
  }
}
