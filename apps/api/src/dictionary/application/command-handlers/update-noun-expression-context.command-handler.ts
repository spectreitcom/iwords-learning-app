import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateNounExpressionContextCommand } from '../commands/update-noun-expression-context.command';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { ExpressionContextNotFoundError } from '../errors';

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
      await this.expressionContextRepository.findById(expressionContextId);

    if (!expressionContext) {
      throw new ExpressionContextNotFoundError(expressionContextId);
    }

    this.eventPublisher.mergeObjectContext(expressionContext);
    expressionContext.updateNoun(translation, isCountable);
    await this.expressionContextRepository.save(expressionContext);
    expressionContext.commit();
  }
}
