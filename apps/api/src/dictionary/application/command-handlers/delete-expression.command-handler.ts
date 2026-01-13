import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { DeleteExpressionCommand } from '../commands/delete-expression.command';
import { ExpressionRepository } from '../ports/expression.repository';
import { AppError } from '../../../common/errors';
import { TransactionRunner } from '../../../common/prisma/transaction-runner';
import { OutboxService } from '../../../common/outbox/outbox.service';
import { IntegrationEvent } from '../../../common/outbox/types';

@CommandHandler(DeleteExpressionCommand)
export class DeleteExpressionCommandHandler
  implements ICommandHandler<DeleteExpressionCommand, void>
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly expressionRepository: ExpressionRepository,
    private readonly transactionRunner: TransactionRunner,
    private readonly outboxService: OutboxService,
  ) {}

  async execute(command: DeleteExpressionCommand): Promise<void> {
    const { expressionId } = command;

    await this.transactionRunner.runInTransaction(async (prisma) => {
      const expression = await this.expressionRepository.findById(
        expressionId,
        prisma,
      );

      if (!expression) {
        throw new AppError(
          'ENTITY_NOT_FOUND',
          `Expression with id ${expressionId} not found.`,
        );
      }

      this.eventPublisher.mergeObjectContext(expression);

      expression.delete();
      await this.expressionRepository.delete(
        expression.getExpressionId().value,
        prisma,
      );

      const event = new IntegrationEvent<{ id: string }>(
        'dictionary.expression-deleted',
        { id: expression.getExpressionId().value },
        { aggregateId: expressionId },
      );

      await this.outboxService.enqueue(event, prisma);

      expression.commit();
    });
  }
}
