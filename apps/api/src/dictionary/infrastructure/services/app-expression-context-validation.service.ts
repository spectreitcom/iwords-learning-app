import { ExpressionContextValidationService } from '../../application/ports/expression-context-validation.service';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppExpressionContextValidationService
  implements ExpressionContextValidationService
{
  constructor(private readonly prismaService: PrismaService) {}

  async exists(expressionContextId: string): Promise<boolean> {
    const expressionContext =
      await this.prismaService.expressionContext.findUnique({
        where: { id: expressionContextId },
      });
    return expressionContext !== null;
  }
}
