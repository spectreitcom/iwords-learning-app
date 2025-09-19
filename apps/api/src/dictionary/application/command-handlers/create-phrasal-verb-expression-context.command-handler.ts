import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreatePhrasalVerbExpressionContextCommand } from '../commands/create-phrasal-verb-expression-context.command';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { ExpressionValidationService } from '../ports/expression-validation.service';
import { ExpressionNotFoundError } from '../errors';
import { ExpressionContext } from '../../domain/expression-context';

@CommandHandler(CreatePhrasalVerbExpressionContextCommand)
export class CreatePhrasalVerbExpressionContextCommandHandler
  implements ICommandHandler<CreatePhrasalVerbExpressionContextCommand, void>
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly expressionContextRepository: ExpressionContextRepository,
    private readonly expressionValidationService: ExpressionValidationService,
  ) {}

  async execute(
    command: CreatePhrasalVerbExpressionContextCommand,
  ): Promise<void> {
    const { expressionId, translation } = command;

    const expressionExists =
      await this.expressionValidationService.exists(expressionId);

    if (!expressionExists) {
      throw new ExpressionNotFoundError(expressionId);
    }

    const expressionContext = ExpressionContext.createPhrasalVerb(
      translation,
      expressionId,
    );
    this.eventPublisher.mergeObjectContext(expressionContext);
    await this.expressionContextRepository.save(expressionContext);
    expressionContext.commit();
  }
}
