import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateVerbExpressionContextCommand } from '../commands/update-verb-expression-context.command';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { VERB } from '../../domain/constants';
import { AppError } from '../../../common/errors';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { OutboxService } from '../../../common/outbox/outbox.service';
import { IntegrationEvent } from '../../../common/outbox/types';

@CommandHandler(UpdateVerbExpressionContextCommand)
export class UpdateVerbExpressionContextCommandHandler
  implements ICommandHandler<UpdateVerbExpressionContextCommand, void>
{
  constructor(
    private readonly expressionContextRepository: ExpressionContextRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly prismaService: PrismaService,
    private readonly outboxService: OutboxService,
  ) {}

  async execute(command: UpdateVerbExpressionContextCommand): Promise<void> {
    const { expressionContextId, translation } = command;

    await this.prismaService.$transaction(async (prisma) => {
      const expressionContext =
        await this.expressionContextRepository.findByIdAndType(
          expressionContextId,
          VERB,
        );

      if (!expressionContext) {
        throw new AppError(
          'ENTITY_NOT_FOUND',
          `Expression context with id ${expressionContextId} not found.`,
        );
      }

      this.eventPublisher.mergeObjectContext(expressionContext);

      expressionContext.updateVerb(translation.toLowerCase());

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
