import { Injectable } from '@nestjs/common';
import { IIntegrationEvent } from './types';
import { PrismaTx } from '../types';

@Injectable()
export class OutboxService {
  async enqueue(event: IIntegrationEvent, tx: PrismaTx) {
    await tx.outboxMessage.create({
      data: {
        aggregateId: event.aggregateId,
        eventName: event.name,
        payload: event.payload as Record<string, any>,
      },
    });
  }
}
