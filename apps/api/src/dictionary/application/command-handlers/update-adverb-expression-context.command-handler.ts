import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAdverbExpressionContextCommand } from '../commands/update-adverb-expression-context.command';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { ExpressionContextNotFoundError } from '../errors';
import { ADVERB } from '../../domain/constants';

@CommandHandler(UpdateAdverbExpressionContextCommand)
export class UpdateAdverbExpressionContextCommandHandler
  implements ICommandHandler<UpdateAdverbExpressionContextCommand, void>
{
  constructor(
    private readonly expressionContextRepository: ExpressionContextRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: UpdateAdverbExpressionContextCommand): Promise<void> {
    const { expressionContextId, translation } = command;

    const expressionContext =
      await this.expressionContextRepository.findByIdAndType(
        expressionContextId,
        ADVERB,
      );

    if (!expressionContext) {
      throw new ExpressionContextNotFoundError(expressionContextId);
    }

    this.eventPublisher.mergeObjectContext(expressionContext);
    expressionContext.updateAdverb(translation.toLowerCase());
    await this.expressionContextRepository.save(expressionContext);
    expressionContext.commit();
  }
}
