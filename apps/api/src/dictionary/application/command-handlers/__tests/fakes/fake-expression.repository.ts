import { ExpressionRepository } from '../../../ports/expression.repository';
import { Expression } from '../../../../domain/expression';

type FakeExpressionModel = {
  id: string;
  phrase: string;
};

export class FakeExpressionRepository implements ExpressionRepository {
  private readonly data = new Map<string, FakeExpressionModel>();

  constructor(initialData: FakeExpressionModel[] = []) {
    initialData.forEach((item) => this.data.set(item.id, item));
  }

  async save(expression: Expression, tx?: any): Promise<void> {
    this.data.set(expression.getExpressionId().value, {
      id: expression.getExpressionId().value,
      phrase: expression.getPhrase(),
    });
  }

  async findById(id: string, tx?: any): Promise<Expression | null> {
    const data = this.data.get(id);

    if (!data) return null;

    return new Expression(data.id, data.phrase);
  }

  async delete(expressionId: string, tx?: any): Promise<void> {
    this.data.delete(expressionId);
  }

  getLength(): number {
    return this.data.size;
  }
}
