import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GenerateSentencesForExpressionContextQuery } from '../queries/generate-sentences-for-expression-context.query';
import { AiService } from '../ports/ai.service';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { AppError } from '../../../common/errors';

export type GenerateSentencesForExpressionContextQueryResponse = {
  sentence: string;
  translation: string;
}[];

@QueryHandler(GenerateSentencesForExpressionContextQuery)
export class GenerateSentencesForExpressionContextQueryHandler
  implements
    IQueryHandler<
      GenerateSentencesForExpressionContextQuery,
      GenerateSentencesForExpressionContextQueryResponse
    >
{
  constructor(
    private readonly aiService: AiService,
    private readonly prismaService: PrismaService,
  ) {}

  async execute(
    query: GenerateSentencesForExpressionContextQuery,
  ): Promise<GenerateSentencesForExpressionContextQueryResponse> {
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

    return await this.aiService.generateSentences(
      expression.phrase,
      expressionContext.translation,
    );
  }
}
