import { PrismaTx } from '../types';
import { TransactionRunner } from './transaction-runner';

export class FakeTransactionRunner implements TransactionRunner {
  async runInTransaction<T>(
    callback: (prisma: PrismaTx) => Promise<T>,
  ): Promise<T> {
    return callback({} as PrismaTx);
  }
}
