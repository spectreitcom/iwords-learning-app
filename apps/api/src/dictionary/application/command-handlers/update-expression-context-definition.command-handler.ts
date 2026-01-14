import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateExpressionContextDefinitionCommand } from '../commands/update-expression-context-definition.command';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { AppError } from '../../../common/errors';
import { OutboxService } from '../../../common/outbox/outbox.service';
import { IntegrationEvent } from '../../../common/outbox/types';
import { TransactionRunner } from '../../../common/prisma/transaction-runner';

@CommandHandler(UpdateExpressionContextDefinitionCommand)
export class UpdateExpressionContextDefinitionCommandHandler
  implements ICommandHandler<UpdateExpressionContextDefinitionCommand, void>
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly expressionContextRepository: ExpressionContextRepository,
    private readonly outboxService: OutboxService,
    private readonly transactionRunner: TransactionRunner,
  ) {}

  async execute(
    command: UpdateExpressionContextDefinitionCommand,
  ): Promise<void> {
    const { expressionContextId, definition, definitionTranslation } = command;

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

      expressionContext.updateDefinition(definition, definitionTranslation);

      await this.expressionContextRepository.save(expressionContext, prisma);

      const event: IntegrationEvent<{
        expressionContextId: string;
        expressionId: string;
        translation: string;
        forms: [string, string, string] | null;
        isIrregular: boolean;
        isCountable: boolean;
        definition: string | null;
        definitionTranslation: string | null;
      }> = new IntegrationEvent(
        'dictionary.expression-context-updated',
        {
          expressionContextId: expressionContext.getExpressionContextId().value,
          expressionId: expressionContext.getExpressionId().value,
          forms: expressionContext.getForms()?.value ?? null,
          isCountable: expressionContext.getIsCountable(),
          isIrregular: expressionContext.getIsIrregular(),
          translation: expressionContext.getTranslation(),
          definition: expressionContext.getDefinition(),
          definitionTranslation: expressionContext.getDefinitionTranslation(),
        },
        {
          aggregateId: expressionContext.getExpressionId().value,
        },
      );

      await this.outboxService.enqueue(event, prisma);

      expressionContext.commit();
    });
  }
}
