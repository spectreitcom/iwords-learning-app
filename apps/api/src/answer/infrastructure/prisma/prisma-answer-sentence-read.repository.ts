import { Injectable } from '@nestjs/common';
import {
  AnswerSentenceReadModel,
  AnswerSentenceReadRepository,
} from '../../application/ports/answer-sentence-read.repository';
import { PrismaTx } from '../../../common/types';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class PrismaAnswerSentenceReadRepository implements AnswerSentenceReadRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findBySentenceId(
    sentenceId: string,
    tx?: PrismaTx,
  ): Promise<AnswerSentenceReadModel | null> {
    const prisma = tx ?? this.prismaService;
    const record = await prisma.answerSentenceReadModel.findUnique({
      where: { sentenceId },
    });

    if (!record) return null;

    return new AnswerSentenceReadModel(
      record.id,
      record.sentenceId,
      record.content,
      record.translation,
      record.expressionContextId,
      record.expressionId,
    );
  }
}
