import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateExpressionCommand } from '../commands/update-expression.command';
import { ExpressionRepository } from '../ports/expression.repository';
import { ExpressionValidationService } from '../ports/expression-validation.service';
import { AppError } from '../../../common/errors';
import { TransactionRunner } from '../../../common/prisma/transaction-runner';
import { OutboxService } from '../../../common/outbox/outbox.service';
import { IntegrationEvent } from '../../../common/outbox/types';

@CommandHandler(UpdateExpressionCommand)
export class UpdateExpressionCommandHandler
  implements ICommandHandler<UpdateExpressionCommand, void>
{
  constructor(
    private readonly expressionRepository: ExpressionRepository,
    private readonly expressionValidationService: ExpressionValidationService,
    private readonly eventPublisher: EventPublisher,
    private readonly transactionRunner: TransactionRunner,
    private readonly outboxService: OutboxService,
  ) {}

  async execute(command: UpdateExpressionCommand): Promise<void> {
    const { expressionId, phrase } = command;

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

      const existingExpressionId =
        await this.expressionValidationService.checkPhrase(
          phrase.toLowerCase(),
        );

      if (existingExpressionId && existingExpressionId !== expressionId) {
        throw new AppError(
          'ALREADY_EXISTS',
          `Expression with phrase ${phrase} already exists.`,
        );
      }

      this.eventPublisher.mergeObjectContext(expression);

      expression.updatePhrase(phrase.toLowerCase());
      await this.expressionRepository.save(expression, prisma);

      const event = new IntegrationEvent<{
        id: string;
        phrase: string;
      }>(
        'dictionary.expression-updated',
        {
          id: expression.getExpressionId().value,
          phrase: expression.getPhrase(),
        },
        {
          aggregateId: expressionId,
        },
      );

      await this.outboxService.enqueue(event, prisma);

      expression.commit();
    });
  }
}
