import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetExpressionByIdQuery } from '../queries/get-expression-by-id.query';
import { ExpressionView } from '../../views/expression.view';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { AppError } from '../../../common/errors';

@QueryHandler(GetExpressionByIdQuery)
export class GetExpressionByIdQueryHandler implements IQueryHandler<
  GetExpressionByIdQuery,
  ExpressionView
> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetExpressionByIdQuery): Promise<ExpressionView> {
    const { expressionId } = query;

    const expression = await this.prismaService.expression.findUnique({
      where: {
        id: expressionId,
      },
    });

    if (!expression)
      throw new AppError(
        'ENTITY_NOT_FOUND',
        `Expression with id ${expressionId} not found.`,
      );

    return new ExpressionView(expression.id, expression.phrase);
  }
}
