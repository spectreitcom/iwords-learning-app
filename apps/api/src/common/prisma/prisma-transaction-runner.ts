import { Injectable } from '@nestjs/common';
import { TransactionRunner } from './transaction-runner';
import { PrismaTx } from '../types';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaTransactionRunner implements TransactionRunner {
  constructor(private readonly prismService: PrismaService) {}

  runInTransaction<T>(callback: (prisma: PrismaTx) => Promise<T>): Promise<T> {
    return this.prismService.$transaction(callback);
  }
}
