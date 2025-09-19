import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateIrregularVerbExpressionContextCommand } from '../commands/create-irregular-verb-expression-context.command';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { ExpressionValidationService } from '../ports/expression-validation.service';
import { ExpressionNotFoundError } from '../errors';
import { ExpressionContext } from '../../domain/expression-context';

export type CreateIrregularVerbExpressionContextCommandResponse = {
  id: string;
};

@CommandHandler(CreateIrregularVerbExpressionContextCommand)
export class CreateIrregularVerbExpressionContextCommandHandler
  implements
    ICommandHandler<
      CreateIrregularVerbExpressionContextCommand,
      CreateIrregularVerbExpressionContextCommandResponse
    >
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly expressionContextRepository: ExpressionContextRepository,
    private readonly expressionValidationService: ExpressionValidationService,
  ) {}

  async execute(
    command: CreateIrregularVerbExpressionContextCommand,
  ): Promise<CreateIrregularVerbExpressionContextCommandResponse> {
    const { expressionId, translation, forms } = command;

    const expressionExists =
      await this.expressionValidationService.exists(expressionId);

    if (!expressionExists) {
      throw new ExpressionNotFoundError(expressionId);
    }

    const expressionContext = ExpressionContext.createIrregularVerb(
      translation,
      forms,
      expressionId,
    );
    this.eventPublisher.mergeObjectContext(expressionContext);
    await this.expressionContextRepository.save(expressionContext);
    expressionContext.commit();

    return { id: expressionContext.getExpressionContextId().value };
  }
}
