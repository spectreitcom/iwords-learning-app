import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AddExpressionContextIdCommand } from '../commands/add-expression-context-id.command';
import { BoxRepository } from '../ports/box.repository';
import { AppError } from '../../../common/errors';
import { ExpressionContextIdAlreadyExists } from '../../domain/errors';

@CommandHandler(AddExpressionContextIdCommand)
export class AddExpressionContextIdCommandHandler
  implements ICommandHandler<AddExpressionContextIdCommand, void>
{
  constructor(
    private readonly boxRepository: BoxRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: AddExpressionContextIdCommand): Promise<void> {
    const { boxId, expressionContextId } = command;

    const box = await this.boxRepository.findById(boxId);

    if (!box) {
      throw new AppError('ENTITY_NOT_FOUND', `Box with id ${boxId} not found`);
    }

    try {
      this.eventPublisher.mergeObjectContext(box);
      box.addExpressionContextId(expressionContextId);
      await this.boxRepository.save(box);
      box.commit();
    } catch (e) {
      if (e instanceof ExpressionContextIdAlreadyExists) {
        throw new AppError(
          'ALREADY_EXISTS',
          `Expression context id ${expressionContextId} already exists`,
        );
      }
      throw e;
    }
  }
}
