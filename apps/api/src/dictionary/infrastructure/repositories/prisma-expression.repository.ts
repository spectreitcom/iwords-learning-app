import { Injectable } from '@nestjs/common';
import { ExpressionRepository } from '../../application/ports/expression.repository';
import { Expression } from '../../domain/expression';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { PrismaTx } from '../../../common/types';

@Injectable()
export class PrismaExpressionRepository implements ExpressionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(expression: Expression, tx?: PrismaTx): Promise<void> {
    const prisma = tx ?? this.prismaService;
    await prisma.expression.upsert({
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

  async findById(id: string, tx?: PrismaTx): Promise<Expression | null> {
    const prisma = tx ?? this.prismaService;
    const expressionData = await prisma.expression.findUnique({
      where: { id },
    });

    if (!expressionData) {
      return null;
    }

    return new Expression(expressionData.id, expressionData.phrase);
  }

  async delete(expressionId: string, tx?: PrismaTx): Promise<void> {
    const prisma = tx ?? this.prismaService;
    await prisma.expression.delete({
      where: { id: expressionId },
    });
  }
}
