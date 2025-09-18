import { Injectable } from '@nestjs/common';
import { ExpressionValidationService } from '../../application/ports/expression-validation.service';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class AppExpressionValidationService
  implements ExpressionValidationService
{
  constructor(private readonly prismaService: PrismaService) {}

  async checkPhrase(phrase: string): Promise<string | null> {
    const expression = await this.prismaService.expression.findUnique({
      where: { phrase },
    });
    return expression ? expression.id : null;
  }
}
