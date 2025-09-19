import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateNounExpressionContextCommand } from '../commands/create-noun-expression-context.command';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { ExpressionValidationService } from '../ports/expression-validation.service';
import { ExpressionNotFoundError } from '../errors';
import { ExpressionContext } from '../../domain/expression-context';

@CommandHandler(CreateNounExpressionContextCommand)
export class CreateNounExpressionContextCommandHandler
  implements ICommandHandler<CreateNounExpressionContextCommand, void>
{
  constructor(
    private readonly expressionContextRepository: ExpressionContextRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly expressionValidationService: ExpressionValidationService,
  ) {}

  async execute(command: CreateNounExpressionContextCommand): Promise<void> {
    const { expressionId, translation, isCountable } = command;

    const expressionExists =
      await this.expressionValidationService.exists(expressionId);

    if (!expressionExists) {
      throw new ExpressionNotFoundError(expressionId);
    }

    const expressionContext = ExpressionContext.createNoun(
      translation,
      expressionId,
      isCountable,
    );
    this.eventPublisher.mergeObjectContext(expressionContext);
    await this.expressionContextRepository.save(expressionContext);
    expressionContext.commit();
  }
}
