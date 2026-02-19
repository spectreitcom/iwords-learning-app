import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetExpressionContextByIdQuery } from '../queries/get-expression-context-by-id.query';
import { ExpressionContextView } from '../../views/expression-context.view';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { AppError } from '../../../common/errors';
import { SentenceView } from '../../views/sentence.view';

@QueryHandler(GetExpressionContextByIdQuery)
export class GetExpressionContextByIdQueryHandler implements IQueryHandler<
  GetExpressionContextByIdQuery,
  ExpressionContextView
> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    query: GetExpressionContextByIdQuery,
  ): Promise<ExpressionContextView> {
    const { expressionContextId } = query;
    const expressionContext =
      await this.prismaService.expressionContext.findUnique({
        where: {
          id: expressionContextId,
        },
        include: {
          sentences: true,
        },
      });

    if (!expressionContext)
      throw new AppError(
        'ENTITY_NOT_FOUND',
        `Expression context with id ${expressionContextId} not found.`,
      );

    return new ExpressionContextView(
      expressionContext.id,
      expressionContext.translation,
      expressionContext.expressionId,
      expressionContext.isCountable,
      expressionContext.isIrregular,
      expressionContext.type,
      expressionContext.forms
        ? (expressionContext.forms as [string, string, string])
        : null,
      expressionContext.sentences.map(
        (sentence) =>
          new SentenceView(
            sentence.id,
            sentence.content,
            sentence.translation,
            sentence.expressionContextId,
          ),
      ),
      expressionContext.definition,
      expressionContext.definitionTranslation,
    );
  }
}
