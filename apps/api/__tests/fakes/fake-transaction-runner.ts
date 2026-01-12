import { TransactionRunner } from '../../src/common/prisma/transaction-runner';

export class FakeTransactionRunner implements TransactionRunner {
  runInTransaction<T>(callback: (prisma: any) => Promise<T>): Promise<T> {
    return callback({} as any);
  }
}
