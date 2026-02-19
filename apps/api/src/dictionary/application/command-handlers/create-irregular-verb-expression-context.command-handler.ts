import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateIrregularVerbExpressionContextCommand } from '../commands/create-irregular-verb-expression-context.command';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { ExpressionContext } from '../../domain/expression-context';
import { AppError } from '../../../common/errors';
import { OutboxService } from '../../../common/outbox/outbox.service';
import { ExpressionRepository } from '../ports/expression.repository';
import { IntegrationEvent } from '../../../common/outbox/types';
import { TransactionRunner } from '../../../common/prisma/transaction-runner';

export type CreateIrregularVerbExpressionContextCommandResponse = {
  id: string;
};

@CommandHandler(CreateIrregularVerbExpressionContextCommand)
export class CreateIrregularVerbExpressionContextCommandHandler implements ICommandHandler<
  CreateIrregularVerbExpressionContextCommand,
  CreateIrregularVerbExpressionContextCommandResponse
> {
  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly expressionContextRepository: ExpressionContextRepository,
    private readonly expressionRepository: ExpressionRepository,
    private readonly outboxService: OutboxService,
    private readonly transactionRunner: TransactionRunner,
  ) {}

  async execute(
    command: CreateIrregularVerbExpressionContextCommand,
  ): Promise<CreateIrregularVerbExpressionContextCommandResponse> {
    const { expressionId, translation, forms } = command;

    return this.transactionRunner.runInTransaction(async (prisma) => {
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

      const expressionContext = ExpressionContext.createIrregularVerb(
        translation.toLowerCase(),
        forms.map((form) => form.toLowerCase()) as [string, string, string],
        expressionId,
      );
      this.eventPublisher.mergeObjectContext(expressionContext);

      await this.expressionContextRepository.save(expressionContext, prisma);

      const event: IntegrationEvent<{
        expressionContextId: string;
        expressionId: string;
        phrase: string;
        type: string;
        translation: string;
        forms: [string, string, string] | null;
        isIrregular: boolean;
        isCountable: boolean;
      }> = new IntegrationEvent(
        'dictionary.expression-context-created',
        {
          expressionContextId: expressionContext.getExpressionContextId().value,
          forms: expressionContext.getForms()?.value ?? null,
          expressionId: expression.getExpressionId().value,
          isCountable: expressionContext.getIsCountable(),
          type: expressionContext.getType().value,
          translation: expressionContext.getTranslation(),
          isIrregular: expressionContext.getIsIrregular(),
          phrase: expression.getPhrase(),
        },
        {
          aggregateId: expressionContext.getExpressionId().value,
        },
      );

      await this.outboxService.enqueue(event, prisma);

      expressionContext.commit();

      return { id: expressionContext.getExpressionContextId().value };
    });
  }
}
