import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePhrasalVerbExpressionContextCommand } from '../commands/update-phrasal-verb-expression-context.command';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { PHRASAL_VERB } from '../../domain/constants';
import { AppError } from '../../../common/errors';

@CommandHandler(UpdatePhrasalVerbExpressionContextCommand)
export class UpdatePhrasalVerbExpressionContextCommandHandler
  implements ICommandHandler<UpdatePhrasalVerbExpressionContextCommand, void>
{
  constructor(
    private readonly expressionContextRepository: ExpressionContextRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(
    command: UpdatePhrasalVerbExpressionContextCommand,
  ): Promise<void> {
    const { expressionContextId, translation } = command;

    const expressionContext =
      await this.expressionContextRepository.findByIdAndType(
        expressionContextId,
        PHRASAL_VERB,
      );

    if (!expressionContext) {
      throw new AppError(
        'ENTITY_NOT_FOUND',
        `Expression context with id ${expressionContextId} not found.`,
      );
    }

    this.eventPublisher.mergeObjectContext(expressionContext);
    expressionContext.updatePhrasalVerb(translation.toLowerCase());
    await this.expressionContextRepository.save(expressionContext);
    expressionContext.commit();
  }
}
