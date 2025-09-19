import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateVerbExpressionContextCommand } from '../commands/create-verb-expression-context.command';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { ExpressionValidationService } from '../ports/expression-validation.service';
import { ExpressionNotFoundError } from '../errors';
import { ExpressionContext } from '../../domain/expression-context';

export type CreateVerbExpressionContextCommandResponse = {
  id: string;
};

@CommandHandler(CreateVerbExpressionContextCommand)
export class CreateVerbExpressionContextCommandHandler
  implements
    ICommandHandler<
      CreateVerbExpressionContextCommand,
      CreateVerbExpressionContextCommandResponse
    >
{
  constructor(
    private readonly expressionContextRepository: ExpressionContextRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly expressionValidationService: ExpressionValidationService,
  ) {}

  async execute(
    command: CreateVerbExpressionContextCommand,
  ): Promise<CreateVerbExpressionContextCommandResponse> {
    const { expressionId, translation } = command;

    const expressionExists =
      await this.expressionValidationService.exists(expressionId);

    if (!expressionExists) {
      throw new ExpressionNotFoundError(expressionId);
    }

    const expressionContext = ExpressionContext.createVerb(
      translation,
      expressionId,
    );
    this.eventPublisher.mergeObjectContext(expressionContext);
    await this.expressionContextRepository.save(expressionContext);
    expressionContext.commit();

    return { id: expressionContext.getExpressionContextId().value };
  }
}
