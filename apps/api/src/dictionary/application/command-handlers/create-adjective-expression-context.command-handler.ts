import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateAdjectiveExpressionContextCommand } from '../commands/create-adjective-expression-context.command';
import { ExpressionContextRepository } from '../ports/expression-context.repository';
import { ExpressionValidationService } from '../ports/expression-validation.service';
import { ExpressionContext } from '../../domain/expression-context';
import { AppError } from '../../../common/errors';

export type CreateAdjectiveExpressionContextCommandResponse = {
  id: string;
};

@CommandHandler(CreateAdjectiveExpressionContextCommand)
export class CreateAdjectiveExpressionContextCommandHandler
  implements
    ICommandHandler<
      CreateAdjectiveExpressionContextCommand,
      CreateAdjectiveExpressionContextCommandResponse
    >
{
  constructor(
    private readonly expressionContextRepository: ExpressionContextRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly expressionValidationService: ExpressionValidationService,
  ) {}

  async execute(
    command: CreateAdjectiveExpressionContextCommand,
  ): Promise<CreateAdjectiveExpressionContextCommandResponse> {
    const { expressionId, translation } = command;

    const expressionExists =
      await this.expressionValidationService.exists(expressionId);

    if (!expressionExists) {
      throw new AppError(
        'ENTITY_NOT_FOUND',
        `Expression with id ${expressionId} not found.`,
      );
    }

    const expressionContext = ExpressionContext.createAdjective(
      translation.toLowerCase(),
      expressionId,
    );
    this.eventPublisher.mergeObjectContext(expressionContext);
    await this.expressionContextRepository.save(expressionContext);
    expressionContext.commit();

    return { id: expressionContext.getExpressionContextId().value };
  }
}
