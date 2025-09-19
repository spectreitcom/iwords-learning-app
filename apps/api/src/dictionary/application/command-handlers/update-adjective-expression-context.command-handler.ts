import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAdjectiveExpressionContextCommand } from '../commands/update-adjective-expression-context.command';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { ExpressionContextNotFoundError } from '../errors';

@CommandHandler(UpdateAdjectiveExpressionContextCommand)
export class UpdateAdjectiveExpressionContextCommandHandler
  implements ICommandHandler<UpdateAdjectiveExpressionContextCommand, void>
{
  constructor(
    private readonly expressionContextRepository: ExpressionContextRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(
    command: UpdateAdjectiveExpressionContextCommand,
  ): Promise<void> {
    const { expressionContextId, translation } = command;

    const expressionContext =
      await this.expressionContextRepository.findById(expressionContextId);

    if (!expressionContext) {
      throw new ExpressionContextNotFoundError(expressionContextId);
    }

    this.eventPublisher.mergeObjectContext(expressionContext);
    expressionContext.updateAdjective(translation);
    await this.expressionContextRepository.save(expressionContext);
    expressionContext.commit();
  }
}
