import { IntegrationEvent } from './types';
import { PrismaTx } from '../types';

export abstract class OutboxService {
  abstract enqueue<T extends Record<string, any>>(
    event: IntegrationEvent<T>,
    tx: PrismaTx,
  ): Promise<void>;
}
