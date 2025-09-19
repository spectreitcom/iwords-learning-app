import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { DeleteExpressionContextCommand } from '../commands/delete-expression-context.command';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { ExpressionContextNotFoundError } from '../errors';

@CommandHandler(DeleteExpressionContextCommand)
export class DeleteExpressionContextCommandHandler
  implements ICommandHandler<DeleteExpressionContextCommand, void>
{
  constructor(
    private readonly expressionContextRepository: ExpressionContextRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: DeleteExpressionContextCommand): Promise<void> {
    const { expressionContextId } = command;

    const expressionContext =
      await this.expressionContextRepository.findById(expressionContextId);

    if (!expressionContext) {
      throw new ExpressionContextNotFoundError(expressionContextId);
    }
    this.eventPublisher.mergeObjectContext(expressionContext);
    expressionContext.delete();
    await this.expressionContextRepository.delete(expressionContextId);
    expressionContext.commit();
  }
}
