import { Injectable } from '@nestjs/common';
import { IntegrationEvent } from './types';
import { PrismaTx } from '../types';

@Injectable()
export class OutboxService {
  async enqueue<T extends Record<string, any>>(
    event: IntegrationEvent<T>,
    tx: PrismaTx,
  ) {
    await tx.outboxMessage.create({
      data: {
        aggregateId: event.meta.aggregateId,
        eventName: event.type,
        payload: event.payload,
      },
    });
  }
}
