import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMemoryScanResultsCommand } from '../commmands/create-memory-scan-results.command';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { Clock } from '../../../common/clock/clock';

@CommandHandler(CreateMemoryScanResultsCommand)
export class CreateMemoryScanResultsCommandHandler implements ICommandHandler<
  CreateMemoryScanResultsCommand,
  string
> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly clock: Clock,
  ) {}

  async execute(command: CreateMemoryScanResultsCommand): Promise<string> {
    const { userId, rememberingTime, rememberedItemsCount } = command;

    const itemsCount = await this.getCountMemoryScanForToday(command.userId);

    const result = await this.prismaService.memoryScanResults.create({
      data: {
        userId,
        itemsCount,
        rememberedItemsCount,
        rememberingTime,
      },
    });

    return result.id;
  }

  private async getCountMemoryScanForToday(userId: string): Promise<number> {
    const today = this.clock.today();

    return await this.prismaService.memoryScanLearnedItems.count({
      where: {
        userId,
        createdAt: today,
      },
    });
  }
}
