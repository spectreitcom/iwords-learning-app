import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ExpressionPhraseUpdatedEvent } from '../../domain/events/expression-phrase-updated.event';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';

@EventsHandler(ExpressionPhraseUpdatedEvent)
export class ExpressionPhraseUpdatedEventHandler
  implements IEventHandler<ExpressionPhraseUpdatedEvent>
{
  private readonly logger = new Logger(
    ExpressionPhraseUpdatedEventHandler.name,
  );

  constructor(private readonly prismaService: PrismaService) {}

  async handle(event: ExpressionPhraseUpdatedEvent) {
    this.logger.debug(JSON.stringify(event));
    const { expressionId, newPhrase } = event;
    await this.prismaService.dictionaryReadModel.updateMany({
      where: { expressionId },
      data: { phrase: newPhrase },
    });
  }
}
