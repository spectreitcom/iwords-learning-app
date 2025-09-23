import { Injectable } from '@nestjs/common';
import { ExpressionContextRepository } from '../../application/ports/expression-context.repository';
import { ExpressionContext } from '../../domain/expression-context';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { ExpressionContextId } from '../../domain/value-objects/expression-context-id';
import { ExpressionId } from '../../domain/value-objects/expression-id';
import { ExpressionType } from '../../domain/value-objects/expression-type';
import { VerbForms } from '../../domain/value-objects/verb-forms';

@Injectable()
export class PrismaExpressionContextRepository
  implements ExpressionContextRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async save(expressionContext: ExpressionContext): Promise<void> {
    const forms = expressionContext.getForms();

    await this.prismaService.expressionContext.upsert({
      where: {
        id: expressionContext.getExpressionContextId().value,
      },
      update: {
        translation: expressionContext.getTranslation(),
        isCountable: expressionContext.getIsCountable(),
        type: expressionContext.getType().value,
        forms: forms ? forms.value : [],
        isIrregular: expressionContext.getIsIrregular(),
      },
      create: {
        id: expressionContext.getExpressionContextId().value,
        translation: expressionContext.getTranslation(),
        isCountable: expressionContext.getIsCountable(),
        type: expressionContext.getType().value,
        forms: forms ? forms.value : [],
        isIrregular: expressionContext.getIsIrregular(),
        expressionId: expressionContext.getExpressionId().value,
      },
    });
  }

  async findById(
    expressionContextId: string,
  ): Promise<ExpressionContext | null> {
    const record = await this.prismaService.expressionContext.findUnique({
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
    );
  }

  async delete(expressionContextId: string): Promise<void> {
    await this.prismaService.expressionContext.delete({
      where: { id: expressionContextId },
    });
  }

  async findByIdAndType(
    expressionContextId: string,
    type: string,
  ): Promise<ExpressionContext | null> {
    const record = await this.prismaService.expressionContext.findUnique({
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
    );
  }
}
