import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateVerbExpressionContextCommand } from '../commands/create-verb-expression-context.command';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { ExpressionContext } from '../../domain/expression-context';
import { AppError } from '../../../common/errors';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { OutboxService } from '../../../common/outbox/outbox.service';
import { IntegrationEvent } from '../../../common/outbox/types';
import { ExpressionRepository } from '../ports/expression.repository';

export type CreateVerbExpressionContextCommandResponse = {
  id: string;
};

@CommandHandler(CreateVerbExpressionContextCommand)
export class CreateVerbExpressionContextCommandHandler
  implements
    ICommandHandler<
      CreateVerbExpressionContextCommand,
      CreateVerbExpressionContextCommandResponse
    >
{
  constructor(
    private readonly expressionContextRepository: ExpressionContextRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly expressionRepository: ExpressionRepository,
    private readonly prismaService: PrismaService,
    private readonly outboxService: OutboxService,
  ) {}

  async execute(
    command: CreateVerbExpressionContextCommand,
  ): Promise<CreateVerbExpressionContextCommandResponse> {
    const { expressionId, translation } = command;

    return this.prismaService.$transaction(async (prisma) => {
      const expression = await this.expressionRepository.findById(expressionId);

      if (!expression) {
        throw new AppError(
          'ENTITY_NOT_FOUND',
          `Expression with id ${expressionId} not found.`,
        );
      }

      const expressionContext = ExpressionContext.createVerb(
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
