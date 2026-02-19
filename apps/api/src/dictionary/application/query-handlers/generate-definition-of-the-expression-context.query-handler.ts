import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GenerateDefinitionOfTheExpressionContextQuery } from '../queries/generate-definition-of-the-expression-context.query';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { AppError } from '../../../common/errors';
import { AiService } from '../ports/ai.service';

export type GenerateDefinitionOfTheExpressionContextQueryResponse = {
  definition: string;
  translation: string;
};

@QueryHandler(GenerateDefinitionOfTheExpressionContextQuery)
export class GenerateDefinitionOfTheExpressionContextQueryHandler implements IQueryHandler<
  GenerateDefinitionOfTheExpressionContextQuery,
  GenerateDefinitionOfTheExpressionContextQueryResponse
> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly aiService: AiService,
  ) {}

  async execute(
    query: GenerateDefinitionOfTheExpressionContextQuery,
  ): Promise<GenerateDefinitionOfTheExpressionContextQueryResponse> {
    const { expressionContextId } = query;

    const expressionContext =
      await this.prismaService.expressionContext.findUnique({
        where: {
          id: expressionContextId,
        },
      });

    if (!expressionContext)
      throw new AppError(
        'ENTITY_NOT_FOUND',
        `Expression context with id ${expressionContextId} not found.`,
      );

    const expression = await this.prismaService.expression.findUnique({
      where: {
        id: expressionContext.expressionId,
      },
    });

    if (!expression)
      throw new AppError('ENTITY_NOT_FOUND', 'Expression not found.');

    return await this.aiService.generateDefinition(
      expression.phrase,
      expressionContext.translation,
    );
  }
}
