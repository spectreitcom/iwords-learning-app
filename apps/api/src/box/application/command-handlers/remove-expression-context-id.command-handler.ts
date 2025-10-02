import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { RemoveExpressionContextIdCommand } from '../commands/remove-expression-context-id.command';
import { BoxRepository } from '../ports/box.repository';
import { AppError } from '../../../common/errors';

@CommandHandler(RemoveExpressionContextIdCommand)
export class RemoveExpressionContextIdCommandHandler
  implements ICommandHandler<RemoveExpressionContextIdCommand, void>
{
  constructor(
    private readonly boxRepository: BoxRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: RemoveExpressionContextIdCommand): Promise<void> {
    const { boxId, expressionContextId } = command;

    const box = await this.boxRepository.findById(boxId);

    if (!box) {
      throw new AppError('ENTITY_NOT_FOUND', `Box with id ${boxId} not found`);
    }

    this.eventPublisher.mergeObjectContext(box);
    box.removeExpressionContextId(expressionContextId);
    await this.boxRepository.save(box);
    box.commit();
  }
}
