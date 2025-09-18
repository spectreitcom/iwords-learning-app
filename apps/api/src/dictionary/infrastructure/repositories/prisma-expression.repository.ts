import { Injectable } from '@nestjs/common';
import { ExpressionRepository } from '../../application/ports/expression.repository';
import { Expression } from '../../domain/expression';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class PrismaExpressionRepository implements ExpressionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(expression: Expression): Promise<void> {
    if (expression.shouldBeDeleted()) {
      await this.prismaService.expression.delete({
        where: { id: expression.getExpressionId().value },
      });
      return;
    }

    await this.prismaService.expression.upsert({
      where: { id: expression.getExpressionId().value },
      update: {
        phrase: expression.getPhrase(),
      },
      create: {
        id: expression.getExpressionId().value,
        phrase: expression.getPhrase(),
      },
    });
  }

  async findById(id: string): Promise<Expression | null> {
    const expressionData = await this.prismaService.expression.findUnique({
      where: { id },
    });

    if (!expressionData) {
      return null;
    }

    return new Expression(expressionData.id, expressionData.phrase);
  }
}
