import { Injectable } from '@nestjs/common';
import { GenerateRepetitionService } from '../application/ports/generate-repetition.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Clock } from '../../common/clock/clock';

@Injectable()
export class BasicRepetitionGeneratorService implements GenerateRepetitionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly clock: Clock,
  ) {}

  async generate(userId: string): Promise<string[]> {
    const record = await this.prismaService.boxDailyRepetition.findUnique({
      where: { userId },
    });

    const repetitionItems =
      await this.prismaService.boxRepetitionUserData.findMany({
        where: { userId, nextRepetition: { lte: this.clock.now() } },
        orderBy: { lastLearned: 'asc' },
        take: 6,
      });

    const boxIds: string[] = !repetitionItems.length
      ? (
          await this.prismaService.box.findMany({
            take: 6,
          })
        ).map((box) => box.id)
      : repetitionItems.map((item) => item.boxId);

    if (!record) {
      await this.prismaService.boxDailyRepetition.create({
        data: {
          userId,
          boxIds,
        },
      });
    } else {
      await this.prismaService.boxDailyRepetition.update({
        where: { userId },
        data: {
          boxIds,
        },
      });
    }

    return boxIds;
  }
}
