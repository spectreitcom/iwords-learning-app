import { Inject, Injectable } from '@nestjs/common';
import { InboxReceiveInput, InboxSource } from './types';
import { PrismaService } from '../prisma/prisma.service';
import { INBOX_ROUTER, InboxRouterFn } from './inbox.router';
import { VerifySignatureStrategy } from './verify-signature-strategies/verify-signature.strategy';
import { Clock } from '../clock/clock';

@Injectable()
export class InboxService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(INBOX_ROUTER) private readonly router: InboxRouterFn,
    private readonly clock: Clock,
  ) {}

  async receive(
    message: InboxReceiveInput,
    verifySignatureStrategy?: VerifySignatureStrategy,
  ) {
    if (verifySignatureStrategy) {
      await verifySignatureStrategy.verify();
    }

    await this.prisma.inboxMessage.create({
      data: { ...message },
    });
  }

  async tick() {
    const batch = await this.prisma.inboxMessage.findMany({
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
        await this.router({
          topic: msg.topic,
          payload: msg.payload as Record<string, any>,
          source: msg.source as InboxSource,
        });

        await this.prisma.inboxMessage.update({
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
        await this.prisma.inboxMessage.update({
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
