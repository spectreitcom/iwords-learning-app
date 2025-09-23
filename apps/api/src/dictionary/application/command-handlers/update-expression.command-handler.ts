import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateExpressionCommand } from '../commands/update-expression.command';
import { ExpressionRepository } from '../ports/expression.repository';
import { ExpressionValidationService } from '../ports/expression-validation.service';
import {
  ExpressionNotFoundError,
  ExpressionPhraseAlreadyTakenError,
} from '../errors';

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
      throw new ExpressionNotFoundError(expressionId);
    }

    const existingExpressionId =
      await this.expressionValidationService.checkPhrase(phrase.toLowerCase());

    if (existingExpressionId && existingExpressionId !== expressionId) {
      throw new ExpressionPhraseAlreadyTakenError(phrase);
    }

    expression.updatePhrase(phrase.toLowerCase());
    this.eventPublisher.mergeObjectContext(expression);
    await this.expressionRepository.save(expression);
    expression.commit();
  }
}
