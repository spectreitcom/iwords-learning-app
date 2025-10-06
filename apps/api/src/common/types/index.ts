import { PrismaClient } from '@prisma/client';

export type CollectionWithPagination<T> = {
  data: T[];
  total: number;
  currentPage: number;
};

export type PrismaTx = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;
