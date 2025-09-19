import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateIrregularVerbExpressionContextCommand } from '../commands/update-irregular-verb-expression-context.command';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { ExpressionContextNotFoundError } from '../errors';

@CommandHandler(UpdateIrregularVerbExpressionContextCommand)
export class UpdateIrregularVerbExpressionContextCommandHandler
  implements ICommandHandler<UpdateIrregularVerbExpressionContextCommand, void>
{
  constructor(
    private readonly expressionContextRepository: ExpressionContextRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(
    command: UpdateIrregularVerbExpressionContextCommand,
  ): Promise<void> {
    const { expressionContextId, translation, forms } = command;

    const expressionContext =
      await this.expressionContextRepository.findById(expressionContextId);

    if (!expressionContext) {
      throw new ExpressionContextNotFoundError(expressionContextId);
    }

    this.eventPublisher.mergeObjectContext(expressionContext);
    expressionContext.updateIrregularVerb(translation, forms);
    await this.expressionContextRepository.save(expressionContext);
    expressionContext.commit();
  }
}
