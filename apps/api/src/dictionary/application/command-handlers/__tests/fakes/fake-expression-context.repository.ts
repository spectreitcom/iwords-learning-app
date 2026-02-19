import { ExpressionContextRepository } from '../../../ports/expression-context.repository';
import { ExpressionContext } from '../../../../domain/expression-context';
import { ExpressionContextId } from '../../../../domain/value-objects/expression-context-id';
import { ExpressionId } from '../../../../domain/value-objects/expression-id';
import { ExpressionType } from '../../../../domain/value-objects/expression-type';
import { VerbForms } from '../../../../domain/value-objects/verb-forms';
import { PrismaTx } from '../../../../../common/types';

type FakeExpressionContextModel = {
  expressionContextId: string;
  expressionId: string;
  translation: string;
  isCountable: boolean | null;
  type: string;
  forms: string[];
  isIrregular: boolean | null;
  definition: string | null;
  definitionTranslation: string | null;
};

export class FakeExpressionContextRepository implements ExpressionContextRepository {
  private readonly data = new Map<string, FakeExpressionContextModel>();

  constructor(initialData: FakeExpressionContextModel[] = []) {
    initialData.forEach((item) =>
      this.data.set(item.expressionContextId, item),
    );
  }

  async save(expressionContext: ExpressionContext, tx?: any): Promise<void> {
    this.data.set(expressionContext.getExpressionContextId().value, {
      expressionContextId: expressionContext.getExpressionContextId().value,
      expressionId: expressionContext.getExpressionId().value,
      translation: expressionContext.getTranslation(),
      isCountable: expressionContext.getIsCountable(),
      type: expressionContext.getType().value,
      forms: expressionContext.getForms()?.value ?? [],
      isIrregular: expressionContext.getIsIrregular(),
      definition: expressionContext.getDefinition(),
      definitionTranslation: expressionContext.getDefinitionTranslation(),
    });
  }

  async findById(
    expressionContextId: string,
    tx?: any,
  ): Promise<ExpressionContext | null> {
    const data = this.data.get(expressionContextId);

    if (!data) return null;

    return new ExpressionContext(
      ExpressionContextId.fromString(data.expressionContextId),
      ExpressionId.fromString(data.expressionId),
      data.translation,
      data.isCountable ?? false,
      ExpressionType.fromString(data.type),
      data.forms.length > 0
        ? VerbForms.fromArray(data.forms as [string, string, string])
        : null,
      data.isIrregular ?? false,
      data.definition,
      data.definitionTranslation,
    );
  }

  async delete(expressionContextId: string, tx?: any): Promise<void> {
    this.data.delete(expressionContextId);
  }

  async findByIdAndType(
    expressionContextId: string,
    type: string,
    tx?: any,
  ): Promise<ExpressionContext | null> {
    const context = await this.findById(expressionContextId);

    if (context?.getType().value === type) {
      return context;
    }

    return null;
  }

  async findByExpressionId(
    expressionId: string,
    tx?: PrismaTx,
  ): Promise<ExpressionContext[]> {
    const contexts: ExpressionContext[] = [];

    for (const data of this.data.values()) {
      if (data.expressionId === expressionId) {
        const context = new ExpressionContext(
          ExpressionContextId.fromString(data.expressionContextId),
          ExpressionId.fromString(data.expressionId),
          data.translation,
          data.isCountable ?? false,
          ExpressionType.fromString(data.type),
          data.forms.length > 0
            ? VerbForms.fromArray(data.forms as [string, string, string])
            : null,
          data.isIrregular ?? false,
          data.definition,
          data.definitionTranslation,
        );
        contexts.push(context);
      }
    }

    return contexts;
  }

  getLength(): number {
    return this.data.size;
  }
}
