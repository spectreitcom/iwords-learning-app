import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateNounExpressionContextCommand } from '../commands/update-noun-expression-context.command';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { NOUN } from '../../domain/constants';
import { AppError } from '../../../common/errors';

@CommandHandler(UpdateNounExpressionContextCommand)
export class UpdateNounExpressionContextCommandHandler
  implements ICommandHandler<UpdateNounExpressionContextCommand, void>
{
  constructor(
    private readonly expressionContextRepository: ExpressionContextRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: UpdateNounExpressionContextCommand): Promise<void> {
    const { expressionContextId, translation, isCountable } = command;

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
    await this.expressionContextRepository.save(expressionContext);
    expressionContext.commit();
  }
}
