import { Injectable } from '@nestjs/common';
import { SentenceRepository } from '../../application/ports/sentece.repository';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { Sentence } from '../../domain/sentence';
import { SentenceId } from '../../domain/value-objects/sentence-id';
import { ExpressionContextId } from '../../domain/value-objects/expression-context-id';
import { PrismaTx } from '../../../common/types';

@Injectable()
export class PrismaSentenceRepository implements SentenceRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(sentence: Sentence, tx?: PrismaTx): Promise<void> {
    const prisma = tx ?? this.prismaService;

    await prisma.sentence.upsert({
      where: { id: sentence.getSentenceId().value },
      update: {
        content: sentence.getContent(),
        translation: sentence.getTranslation(),
        expressionContextId: sentence.getExpressionContextId().value,
      },
      create: {
        id: sentence.getSentenceId().value,
        content: sentence.getContent(),
        translation: sentence.getTranslation(),
        expressionContextId: sentence.getExpressionContextId().value,
      },
    });
  }

  async findById(sentenceId: string): Promise<Sentence | null> {
    const sentenceData = await this.prismaService.sentence.findUnique({
      where: { id: sentenceId },
    });

    if (!sentenceData) {
      return null;
    }

    return new Sentence(
      SentenceId.fromString(sentenceData.id),
      sentenceData.content,
      sentenceData.translation,
      ExpressionContextId.fromString(sentenceData.expressionContextId),
    );
  }

  async delete(sentenceId: string, tx?: PrismaTx): Promise<void> {
    const prisma = tx ?? this.prismaService;
    await prisma.sentence.delete({
      where: { id: sentenceId },
    });
  }
}
