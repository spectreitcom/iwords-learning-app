import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { DeleteExpressionCommand } from '../commands/delete-expression.command';
import { ExpressionRepository } from '../ports/expression.repository';
import { ExpressionNotFoundError } from '../errors';

@CommandHandler(DeleteExpressionCommand)
export class DeleteExpressionCommandHandler
  implements ICommandHandler<DeleteExpressionCommand, void>
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly expressionRepository: ExpressionRepository,
  ) {}

  async execute(command: DeleteExpressionCommand): Promise<void> {
    const { expressionId } = command;

    const expression = await this.expressionRepository.findById(expressionId);

    if (!expression) {
      throw new ExpressionNotFoundError(expressionId);
    }

    expression.delete();
    this.eventPublisher.mergeObjectContext(expression);
    await this.expressionRepository.delete(expression.getExpressionId().value);
    expression.commit();
  }
}
