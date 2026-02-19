import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { IntegrationEvent } from '../../../common/outbox/types';
import { Logger } from '@nestjs/common';
import { TransactionRunner } from '../../../common/prisma/transaction-runner';

type EventPayload = {
  id: string;
};

@EventsHandler(IntegrationEvent)
export class DictionaryExpressionDeletedEventHandler implements IEventHandler<
  IntegrationEvent<EventPayload>
> {
  private readonly logger = new Logger(
    `Answer Domain - ${DictionaryExpressionDeletedEventHandler.name}`,
  );

  constructor(private readonly transactionRunner: TransactionRunner) {}

  async handle(event: IntegrationEvent<EventPayload>) {
    if (event.type !== 'dictionary.expression-deleted') return null;
    this.logger.debug(JSON.stringify(event));
    const { id } = event.payload;

    await this.transactionRunner.runInTransaction(async (prisma) => {
      await prisma.answerExpressionContextReadModel.deleteMany({
        where: {
          expressionId: id,
        },
      });

      await prisma.answerSentenceReadModel.deleteMany({
        where: {
          expressionId: id,
        },
      });
    });
  }
}
