import { Injectable } from '@nestjs/common';
import { ExpressionContextRepository } from '../../application/ports/expression-context.repository';
import { ExpressionContext } from '../../domain/expression-context';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { ExpressionContextId } from '../../domain/value-objects/expression-context-id';
import { ExpressionId } from '../../domain/value-objects/expression-id';
import { ExpressionType } from '../../domain/value-objects/expression-type';
import { VerbForms } from '../../domain/value-objects/verb-forms';
import { PrismaTx } from '../../../common/types';

@Injectable()
export class PrismaExpressionContextRepository
  implements ExpressionContextRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async save(
    expressionContext: ExpressionContext,
    tx?: PrismaTx,
  ): Promise<void> {
    const prisma = tx ?? this.prismaService;

    const forms = expressionContext.getForms();

    await prisma.expressionContext.upsert({
      where: {
        id: expressionContext.getExpressionContextId().value,
      },
      update: {
        translation: expressionContext.getTranslation(),
        isCountable: expressionContext.getIsCountable(),
        type: expressionContext.getType().value,
        forms: forms ? forms.value : [],
        isIrregular: expressionContext.getIsIrregular(),
        definition: expressionContext.getDefinition(),
        definitionTranslation: expressionContext.getDefinitionTranslation(),
      },
      create: {
        id: expressionContext.getExpressionContextId().value,
        translation: expressionContext.getTranslation(),
        isCountable: expressionContext.getIsCountable(),
        type: expressionContext.getType().value,
        forms: forms ? forms.value : [],
        isIrregular: expressionContext.getIsIrregular(),
        expressionId: expressionContext.getExpressionId().value,
        definition: expressionContext.getDefinition(),
        definitionTranslation: expressionContext.getDefinitionTranslation(),
      },
    });
  }

  async findById(
    expressionContextId: string,
    tx?: PrismaTx,
  ): Promise<ExpressionContext | null> {
    const prisma = tx ?? this.prismaService;

    const record = await prisma.expressionContext.findUnique({
      where: { id: expressionContextId },
    });

    if (!record) {
      return null;
    }

    const forms =
      record.forms.length > 0
        ? VerbForms.fromArray(record.forms as [string, string, string])
        : null;

    return new ExpressionContext(
      ExpressionContextId.fromString(record.id),
      ExpressionId.fromString(record.expressionId),
      record.translation,
      record.isCountable,
      ExpressionType.fromString(record.type),
      forms,
      record.isIrregular,
      record.definition,
      record.definitionTranslation,
    );
  }

  async delete(expressionContextId: string, tx?: PrismaTx): Promise<void> {
    const prisma = tx ?? this.prismaService;
    await prisma.expressionContext.delete({
      where: { id: expressionContextId },
    });
  }

  async findByIdAndType(
    expressionContextId: string,
    type: string,
    tx?: PrismaTx,
  ): Promise<ExpressionContext | null> {
    const prisma = tx ?? this.prismaService;

    const record = await prisma.expressionContext.findUnique({
      where: { id: expressionContextId, type },
    });

    if (!record) {
      return null;
    }

    const forms =
      record.forms.length > 0
        ? VerbForms.fromArray(record.forms as [string, string, string])
        : null;

    return new ExpressionContext(
      ExpressionContextId.fromString(record.id),
      ExpressionId.fromString(record.expressionId),
      record.translation,
      record.isCountable,
      ExpressionType.fromString(record.type),
      forms,
      record.isIrregular,
      record.definition,
      record.definitionTranslation,
    );
  }

  async findByExpressionId(
    expressionId: string,
    tx?: PrismaTx,
  ): Promise<ExpressionContext[]> {
    const prisma = tx ?? this.prismaService;

    const records = await prisma.expressionContext.findMany({
      where: {
        expressionId,
      },
    });

    return records.map((record) => {
      const forms =
        record.forms.length > 0
          ? VerbForms.fromArray(record.forms as [string, string, string])
          : null;

      return new ExpressionContext(
        ExpressionContextId.fromString(record.id),
        ExpressionId.fromString(record.expressionId),
        record.translation,
        record.isCountable,
        ExpressionType.fromString(record.type),
        forms,
        record.isIrregular,
        record.definition,
        record.definitionTranslation,
      );
    });
  }
}
