import { OutboxService } from '../../src/common/outbox/outbox.service';
import { IntegrationEvent } from '../../src/common/outbox/types';
import { randomUUID } from 'node:crypto';

export type OutboxMessageModel = {
  id: string;
  eventName: string;
  payload: Record<string, any>;
  aggregateId: string;
  status: 'PENDING' | 'PUBLISHED' | 'FAILED';
  attempts: number;
  nextAttempt: Date;
  createdAt: Date;
  updatedAt: Date;
};

abstract class FakeOutboxServiceClass extends OutboxService {
  abstract getLength(): number;
}

export class FakeOutboxService implements FakeOutboxServiceClass {
  private readonly messages: OutboxMessageModel[] = [];

  async enqueue<T extends Record<string, any>>(
    event: IntegrationEvent<T>,
    _: any,
  ): Promise<void> {
    this.messages.push({
      id: randomUUID(),
      eventName: event.type,
      payload: event.payload,
      aggregateId: event.meta.aggregateId,
      status: 'PENDING',
      attempts: 1,
      nextAttempt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  getLength(): number {
    return this.messages.length;
  }
}
