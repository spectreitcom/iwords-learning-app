import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateNounExpressionContextCommand } from '../commands/update-noun-expression-context.command';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { NOUN } from '../../domain/constants';
import { AppError } from '../../../common/errors';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { OutboxService } from '../../../common/outbox/outbox.service';
import { IntegrationEvent } from '../../../common/outbox/types';

@CommandHandler(UpdateNounExpressionContextCommand)
export class UpdateNounExpressionContextCommandHandler
  implements ICommandHandler<UpdateNounExpressionContextCommand, void>
{
  constructor(
    private readonly expressionContextRepository: ExpressionContextRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly prismaService: PrismaService,
    private readonly outboxService: OutboxService,
  ) {}

  async execute(command: UpdateNounExpressionContextCommand): Promise<void> {
    const { expressionContextId, translation, isCountable } = command;

    await this.prismaService.$transaction(async (prisma) => {
      const expressionContext =
        await this.expressionContextRepository.findByIdAndType(
          expressionContextId,
          NOUN,
        );

      if (!expressionContext) {
        throw new AppError(
          'ENTITY_NOT_FOUND',
          `Expression context with id ${expressionContextId} not found.`,
        );
      }

      this.eventPublisher.mergeObjectContext(expressionContext);

      expressionContext.updateNoun(translation.toLowerCase(), isCountable);

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
