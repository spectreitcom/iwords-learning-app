import { BeginBoxRepository } from '../../../ports/begin-box.repository';
import { BeginBox } from '../../../../domain/begin-box';
import { BeginBoxId } from '../../../../domain/value-objects/begin-box-id';
import { UserId } from '../../../../domain/value-objects/user-id';
import { BoxId } from '../../../../domain/value-objects/box-id';

type FakeBeginBoxModel = {
  id: string;
  userId: string;
  boxId: string;
};

abstract class FakeBeginBoxRepositoryClass extends BeginBoxRepository {
  abstract getLength(): number;
}

export class FakeBeginBoxRepository implements FakeBeginBoxRepositoryClass {
  private readonly data = new Map<string, FakeBeginBoxModel>();

  async save(beginBox: BeginBox): Promise<void> {
    this.data.set(beginBox.getBeginBoxId().value, {
      id: beginBox.getBeginBoxId().value,
      userId: beginBox.getUserId().value,
      boxId: beginBox.getBoxId().value,
    });
  }

  async exists(userId: string, boxId: string): Promise<boolean> {
    for (const item of this.data.values()) {
      if (item.userId === userId && item.boxId === boxId) {
        return true;
      }
    }

    return false;
  }

  async findById(id: string): Promise<BeginBox | null> {
    const item = this.data.get(id);

    if (!item) return null;

    return new BeginBox(
      BeginBoxId.fromString(item.id),
      UserId.fromString(item.userId),
      BoxId.fromString(item.boxId),
    );
  }

  getLength(): number {
    return this.data.size;
  }
}
