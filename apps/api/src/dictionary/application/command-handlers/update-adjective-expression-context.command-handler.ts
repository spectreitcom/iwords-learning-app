import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAdjectiveExpressionContextCommand } from '../commands/update-adjective-expression-context.command';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { ADJECTIVE } from '../../domain/constants';
import { AppError } from '../../../common/errors';

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
      await this.expressionContextRepository.findByIdAndType(
        expressionContextId,
        ADJECTIVE,
      );

    if (!expressionContext) {
      throw new AppError(
        'ENTITY_NOT_FOUND',
        `Expression context with id ${expressionContextId} not found.`,
      );
    }

    this.eventPublisher.mergeObjectContext(expressionContext);
    expressionContext.updateAdjective(translation.toLowerCase());
    await this.expressionContextRepository.save(expressionContext);
    expressionContext.commit();
  }
}
