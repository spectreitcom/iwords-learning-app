import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ExpressionDeletedEvent } from '../../domain/events/expression-deleted.event';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

@EventsHandler(ExpressionDeletedEvent)
export class ExpressionDeletedEventHandler
  implements IEventHandler<ExpressionDeletedEvent>
{
  private readonly logger = new Logger(ExpressionDeletedEventHandler.name);

  constructor(private readonly prismaService: PrismaService) {}

  async handle(event: ExpressionDeletedEvent) {
    this.logger.debug(JSON.stringify(event));
    const { expressionId } = event;
    await this.prismaService.dictionaryReadModel.deleteMany({
      where: { expressionId },
    });
  }
}
