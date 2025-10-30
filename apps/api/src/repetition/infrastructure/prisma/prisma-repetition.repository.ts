import { Injectable } from '@nestjs/common';
import { RepetitionRepository } from '../../application/ports/repetition.repository';
import { Repetition } from 'src/repetition/domain/repetition';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { RepetitionId } from '../../domain/value-objects/repetition-id';
import { UserId } from '../../domain/value-objects/user-id';
import { ExpressionContextId } from '../../domain/value-objects/expression-context-id';
import { NextRepetitionDate } from '../../domain/value-objects/next-repetition-date';

@Injectable()
export class PrismaRepetitionRepository implements RepetitionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(repetition: Repetition): Promise<void> {
    const id = repetition.getRepetitionId().value;
    const userId = repetition.getUserId().value;
    const expressionContextId = repetition.getExpressionContextId().value;
    const nextRepetition = repetition.getNextRepetition().value;

    await this.prismaService.repetition.upsert({
      where: { expressionContextId_userId: { expressionContextId, userId } },
      create: { id, userId, expressionContextId, nextRepetition },
      update: { nextRepetition },
    });
  }

  async findByUser(userId: string): Promise<Repetition[]> {
    const records = await this.prismaService.repetition.findMany({
      where: { userId },
      orderBy: { nextRepetition: 'asc' },
    });

    return records.map(
      (r) =>
        new Repetition(
          RepetitionId.fromString(r.id),
          UserId.fromString(r.userId),
          ExpressionContextId.fromString(r.expressionContextId),
          NextRepetitionDate.create(new Date(r.nextRepetition)),
        ),
    );
  }

  async deleteAllForUser(userId: string): Promise<void> {
    await this.prismaService.repetition.deleteMany({ where: { userId } });
  }

  async deleteOne(userId: string, expressionContextId: string): Promise<void> {
    await this.prismaService.repetition.delete({
      where: { expressionContextId_userId: { expressionContextId, userId } },
    });
  }
}
