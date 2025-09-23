import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePhrasalVerbExpressionContextCommand } from '../commands/update-phrasal-verb-expression-context.command';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { ExpressionContextNotFoundError } from '../errors';
import { PHRASAL_VERB } from '../../domain/constants';

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
      throw new ExpressionContextNotFoundError(expressionContextId);
    }

    this.eventPublisher.mergeObjectContext(expressionContext);
    expressionContext.updatePhrasalVerb(translation.toLowerCase());
    await this.expressionContextRepository.save(expressionContext);
    expressionContext.commit();
  }
}
