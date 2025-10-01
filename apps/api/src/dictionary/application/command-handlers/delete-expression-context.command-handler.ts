import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { DeleteExpressionContextCommand } from '../commands/delete-expression-context.command';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { AppError } from '../../../common/errors';

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
      throw new AppError(
        'ENTITY_NOT_FOUND',
        `Expression context with id ${expressionContextId} not found.`,
      );
    }
    this.eventPublisher.mergeObjectContext(expressionContext);
    expressionContext.delete();
    await this.expressionContextRepository.delete(expressionContextId);
    expressionContext.commit();
  }
}
