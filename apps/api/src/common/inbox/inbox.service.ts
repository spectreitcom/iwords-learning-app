import { Inject, Injectable } from '@nestjs/common';
import { InboxReceiveInput, InboxSource } from './types';
import { PrismaService } from '../prisma/prisma.service';
import { INBOX_ROUTER, InboxRouterFn } from './inbox.router';
import { VerifySignatureStrategy } from './verify-signature-strategies/verify-signature.strategy';

@Injectable()
export class InboxService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(INBOX_ROUTER) private readonly router: InboxRouterFn,
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
    const now = new Date();

    const batch = await this.prisma.inboxMessage.findMany({
      where: {
        status: 'PENDING',
        nextAttemptAt: { lte: now },
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
            nextAttemptAt: new Date(Date.now() + backoff * 1000),
            status: attempts >= 10 ? 'FAILED' : 'PENDING',
          },
        });
      }
    }
  }
}
