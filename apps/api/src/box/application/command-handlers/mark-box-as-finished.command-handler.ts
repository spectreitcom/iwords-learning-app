import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MarkBoxAsFinishedCommand } from '../commands/mark-box-as-finished.command';
import { PrismaService } from '../../../common/prisma/prisma.service';

@CommandHandler(MarkBoxAsFinishedCommand)
export class MarkBoxAsFinishedCommandHandler
  implements ICommandHandler<MarkBoxAsFinishedCommand, void>
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: MarkBoxAsFinishedCommand): Promise<void> {
    const { boxId, userId } = command;

    const now = new Date();
    const yyyy = now.getUTCFullYear();
    const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(now.getUTCDate()).padStart(2, '0');
    const today = new Date(`${yyyy}-${mm}-${dd}T00:00:00.000Z`);

    const record = await this.prismaService.dailyLearnedBox.findFirst({
      where: {
        userId,
        boxId,
        createdAt: today,
      },
    });

    if (record) return;

    await this.prismaService.dailyLearnedBox.create({
      data: {
        userId,
        boxId,
        createdAt: today,
      },
    });
  }
}
