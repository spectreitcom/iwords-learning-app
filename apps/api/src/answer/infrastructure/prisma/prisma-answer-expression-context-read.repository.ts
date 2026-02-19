import { Injectable } from '@nestjs/common';
import {
  AnswerExpressionContextReadModel,
  AnswerExpressionContextReadRepository,
} from '../../application/ports/answer-expression-context-read.repository';
import { PrismaTx } from '../../../common/types';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class PrismaAnswerExpressionContextReadRepository implements AnswerExpressionContextReadRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByExpressionContextId(
    expressionContextId: string,
    tx?: PrismaTx,
  ): Promise<AnswerExpressionContextReadModel | null> {
    const prisma = tx ?? this.prismaService;

    const record = await prisma.answerExpressionContextReadModel.findUnique({
      where: { expressionContextId },
    });

    if (!record) return null;

    return new AnswerExpressionContextReadModel(
      record.id,
      record.phrase,
      record.expressionId,
      record.expressionContextId,
      record.type,
      record.translation,
      record.forms,
      record.isIrregular,
      record.isCountable,
      record.sentenceIds,
    );
  }
}
