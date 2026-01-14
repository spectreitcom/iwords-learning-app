import { BoxRepository } from '../../../ports/box.repository';
import { BoxId } from '../../../../domain/value-objects/box-id';
import { ExpressionContextId } from '../../../../domain/value-objects/expression-context-id';
import { Box } from '../../../../domain/box';

type FakeBoxModel = {
  id: string;
  title: string;
  expressionContextIds: string[];
};

abstract class FakeBoxRepositoryClass extends BoxRepository {
  abstract getLength(): number;
}

export class FakeBoxRepository implements FakeBoxRepositoryClass {
  private readonly data = new Map<string, FakeBoxModel>();

  constructor(initialData: FakeBoxModel[] = []) {
    initialData.forEach((item) => this.data.set(item.id, item));
  }

  async save(box: Box): Promise<void> {
    this.data.set(box.getBoxId().value, {
      id: box.getBoxId().value,
      title: box.getTitle(),
      expressionContextIds: box.getExpressionContextIds().map((id) => id.value),
    });
  }

  async findById(boxId: string): Promise<Box | null> {
    const data = this.data.get(boxId);

    if (!data) return null;

    return new Box(
      BoxId.fromString(data.id),
      data.title,
      data.expressionContextIds.map((id) => ExpressionContextId.fromString(id)),
    );
  }

  async delete(boxId: string): Promise<void> {
    this.data.delete(boxId);
  }

  getLength(): number {
    return this.data.size;
  }
}
