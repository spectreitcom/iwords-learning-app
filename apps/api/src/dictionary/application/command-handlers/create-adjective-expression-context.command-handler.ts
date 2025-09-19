import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateAdjectiveExpressionContextCommand } from '../commands/create-adjective-expression-context.command';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { ExpressionValidationService } from '../ports/expression-validation.service';
import { ExpressionNotFoundError } from '../errors';
import { ExpressionContext } from '../../domain/expression-context';

@CommandHandler(CreateAdjectiveExpressionContextCommand)
export class CreateAdjectiveExpressionContextCommandHandler
  implements ICommandHandler<CreateAdjectiveExpressionContextCommand, void>
{
  constructor(
    private readonly expressionContextRepository: ExpressionContextRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly expressionValidationService: ExpressionValidationService,
  ) {}

  async execute(
    command: CreateAdjectiveExpressionContextCommand,
  ): Promise<void> {
    const { expressionId, translation } = command;

    const expressionExists =
      await this.expressionValidationService.exists(expressionId);

    if (!expressionExists) {
      throw new ExpressionNotFoundError(expressionId);
    }

    const expressionContext = ExpressionContext.createAdjective(
      translation,
      expressionId,
    );
    this.eventPublisher.mergeObjectContext(expressionContext);
    await this.expressionContextRepository.save(expressionContext);
    expressionContext.commit();
  }
}
