import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateExpressionCommand } from '../commands/update-expression.command';
import { ExpressionRepository } from '../ports/expression.repository';
import { ExpressionValidationService } from '../ports/expression-validation.service';
import { AppError } from '../../../common/errors';

@CommandHandler(UpdateExpressionCommand)
export class UpdateExpressionCommandHandler
  implements ICommandHandler<UpdateExpressionCommand, void>
{
  constructor(
    private readonly expressionRepository: ExpressionRepository,
    private readonly expressionValidationService: ExpressionValidationService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: UpdateExpressionCommand): Promise<void> {
    const { expressionId, phrase } = command;

    const expression = await this.expressionRepository.findById(expressionId);

    if (!expression) {
      throw new AppError(
        'ENTITY_NOT_FOUND',
        `Expression with id ${expressionId} not found.`,
      );
    }

    const existingExpressionId =
      await this.expressionValidationService.checkPhrase(phrase.toLowerCase());

    if (existingExpressionId && existingExpressionId !== expressionId) {
      throw new AppError(
        'ALREADY_EXISTS',
        `Expression with phrase ${phrase} already exists.`,
      );
    }

    expression.updatePhrase(phrase.toLowerCase());
    this.eventPublisher.mergeObjectContext(expression);
    await this.expressionRepository.save(expression);
    expression.commit();
  }
}
