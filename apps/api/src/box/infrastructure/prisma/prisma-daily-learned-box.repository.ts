import { Injectable } from '@nestjs/common';
import { DailyLearnedBoxRepository } from '../../application/ports/daily-learned-box.repository';
import { PrismaTx } from '../../../common/types';
import { DailyLearnedBox } from '../../domain/daily-learned-box';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { Clock } from '../../../common/clock/clock';
import { UserId } from '../../domain/value-objects/user-id';
import { BoxId } from '../../domain/value-objects/box-id';
import { DailyLearnedBoxId } from '../../domain/value-objects/daily-learned-box-id';

@Injectable()
export class PrismaDailyLearnedBoxRepository implements DailyLearnedBoxRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly clock: Clock,
  ) {}

  async save(dailyLearnedBox: DailyLearnedBox, tx?: PrismaTx): Promise<void> {
    const prisma = tx ?? this.prismaService;

    await prisma.dailyLearnedBox.create({
      data: {
        id: dailyLearnedBox.getDailyLearnedBoxId().value,
        userId: dailyLearnedBox.getUserId().value,
        boxId: dailyLearnedBox.getBoxId().value,
      },
    });
  }

  async findForToday(
    boxId: string,
    userId: string,
    tx?: PrismaTx,
  ): Promise<DailyLearnedBox | null> {
    const prisma = tx ?? this.prismaService;
    const today = this.clock.today();

    const record = await prisma.dailyLearnedBox.findFirst({
      where: {
        userId,
        boxId,
        createdAt: today,
      },
    });

    if (!record) return null;

    return new DailyLearnedBox(
      DailyLearnedBoxId.fromString(record.id),
      UserId.fromString(record.userId),
      BoxId.fromString(record.boxId),
    );
  }
}
