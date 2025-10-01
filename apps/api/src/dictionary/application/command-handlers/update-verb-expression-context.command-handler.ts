import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateVerbExpressionContextCommand } from '../commands/update-verb-expression-context.command';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { VERB } from '../../domain/constants';
import { AppError } from '../../../common/errors';

@CommandHandler(UpdateVerbExpressionContextCommand)
export class UpdateVerbExpressionContextCommandHandler
  implements ICommandHandler<UpdateVerbExpressionContextCommand, void>
{
  constructor(
    private readonly expressionContextRepository: ExpressionContextRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: UpdateVerbExpressionContextCommand): Promise<void> {
    const { expressionContextId, translation } = command;

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
    await this.expressionContextRepository.save(expressionContext);
    expressionContext.commit();
  }
}
