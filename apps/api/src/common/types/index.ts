import { PrismaService } from '../prisma/prisma.service';

export type CollectionWithPagination<T> = {
  data: T[];
  total: number;
  currentPage: number;
};

export type PrismaTx = Omit<
  PrismaService,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;
