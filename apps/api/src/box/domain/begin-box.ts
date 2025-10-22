import { UserId } from './value-objects/user-id';
import { BoxId } from './value-objects/box-id';
import { BeginBoxId } from './value-objects/begin-box-id';

export class BeginBox {
  private readonly beginBoxId: BeginBoxId;
  private readonly userId: UserId;
  private readonly boxId: BoxId;

  constructor(beginBoxId: BeginBoxId, userId: UserId, boxId: BoxId) {
    this.beginBoxId = beginBoxId;
    this.userId = userId;
    this.boxId = boxId;
  }

  static create(userId: string, boxId: string) {
    return new BeginBox(
      BeginBoxId.create(),
      UserId.fromString(userId),
      BoxId.fromString(boxId),
    );
  }

  getBeginBoxId() {
    return this.beginBoxId;
  }

  getUserId() {
    return this.userId;
  }

  getBoxId() {
    return this.boxId;
  }
}
