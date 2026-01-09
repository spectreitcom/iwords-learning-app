import { Injectable } from '@nestjs/common';
import { GenerateRepetitionService } from '../application/ports/generate-repetition.service';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class BasicRepetitionGeneratorService
  implements GenerateRepetitionService
{
  constructor(private readonly prismaService: PrismaService) {}

  async generate(userId: string): Promise<string[]> {
    const record = await this.prismaService.boxDailyRepetition.findUnique({
      where: { userId },
    });

    const repetitionItems =
      await this.prismaService.boxRepetitionUserData.findMany({
        where: { userId, nextRepetition: { lte: new Date() } },
        orderBy: { lastLearned: 'asc' },
      });

    const boxIds = repetitionItems.map((item) => item.boxId);

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
