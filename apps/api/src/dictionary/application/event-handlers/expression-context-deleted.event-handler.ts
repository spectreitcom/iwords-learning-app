import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ExpressionContextDeletedEvent } from '../../domain/events/expression-context-deleted.event';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

@EventsHandler(ExpressionContextDeletedEvent)
export class ExpressionContextDeletedEventHandler implements IEventHandler<ExpressionContextDeletedEvent> {
  private readonly logger = new Logger(
    `Dictionary Domain - ${ExpressionContextDeletedEventHandler.name}`,
  );

  constructor(private readonly prismaService: PrismaService) {}

  async handle(event: ExpressionContextDeletedEvent) {
    this.logger.debug(JSON.stringify(event));
    const { expressionContextId } = event;
    await this.prismaService.dictionaryReadModel.delete({
      where: { expressionContextId },
    });
  }
}
