import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateAdjectiveExpressionContextCommand } from '../commands/create-adjective-expression-context.command';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { ExpressionContext } from '../../domain/expression-context';
import { AppError } from '../../../common/errors';
import { ExpressionRepository } from '../ports/expression.repository';
import { OutboxService } from '../../../common/outbox/outbox.service';
import { IntegrationEvent } from '../../../common/outbox/types';
import { TransactionRunner } from '../../../common/prisma/transaction-runner';

export type CreateAdjectiveExpressionContextCommandResponse = {
  id: string;
};

@CommandHandler(CreateAdjectiveExpressionContextCommand)
export class CreateAdjectiveExpressionContextCommandHandler
  implements
    ICommandHandler<
      CreateAdjectiveExpressionContextCommand,
      CreateAdjectiveExpressionContextCommandResponse
    >
{
  constructor(
    private readonly expressionContextRepository: ExpressionContextRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly expressionRepository: ExpressionRepository,
    private readonly outboxService: OutboxService,
    private readonly transactionRunner: TransactionRunner,
  ) {}

  async execute(
    command: CreateAdjectiveExpressionContextCommand,
  ): Promise<CreateAdjectiveExpressionContextCommandResponse> {
    const { expressionId, translation } = command;

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

      const expressionContext = ExpressionContext.createAdjective(
        translation.toLowerCase(),
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
