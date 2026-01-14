import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { DeleteExpressionContextCommand } from '../commands/delete-expression-context.command';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { AppError } from '../../../common/errors';
import { OutboxService } from '../../../common/outbox/outbox.service';
import { IntegrationEvent } from '../../../common/outbox/types';
import { TransactionRunner } from '../../../common/prisma/transaction-runner';

@CommandHandler(DeleteExpressionContextCommand)
export class DeleteExpressionContextCommandHandler
  implements ICommandHandler<DeleteExpressionContextCommand, void>
{
  constructor(
    private readonly expressionContextRepository: ExpressionContextRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly outboxService: OutboxService,
    private readonly transactionRunner: TransactionRunner,
  ) {}

  async execute(command: DeleteExpressionContextCommand): Promise<void> {
    const { expressionContextId } = command;

    await this.transactionRunner.runInTransaction(async (prisma) => {
      const expressionContext = await this.expressionContextRepository.findById(
        expressionContextId,
        prisma,
      );

      if (!expressionContext) {
        throw new AppError(
          'ENTITY_NOT_FOUND',
          `Expression context with id ${expressionContextId} not found.`,
        );
      }
      this.eventPublisher.mergeObjectContext(expressionContext);
      expressionContext.delete();
      await this.expressionContextRepository.delete(
        expressionContextId,
        prisma,
      );

      const event: IntegrationEvent<{ expressionContextId: string }> =
        new IntegrationEvent(
          'dictionary.expression-context-deleted',
          { expressionContextId },
          {
            aggregateId: expressionContext.getExpressionId().value,
          },
        );

      await this.outboxService.enqueue(event, prisma);

      expressionContext.commit();
    });
  }
}
