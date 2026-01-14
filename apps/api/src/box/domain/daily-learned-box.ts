import { DailyLearnedBoxId } from './value-objects/daily-learned-box-id';
import { UserId } from './value-objects/user-id';
import { BoxId } from './value-objects/box-id';

// todo: write tests

export class DailyLearnedBox {
  private readonly dailyLearnedBoxId: DailyLearnedBoxId;
  private readonly userId: UserId;
  private readonly boxId: BoxId;

  constructor(
    dailyLearnedBoxId: DailyLearnedBoxId,
    userId: UserId,
    boxId: BoxId,
  ) {
    this.dailyLearnedBoxId = dailyLearnedBoxId;
    this.userId = userId;
    this.boxId = boxId;
  }

  static create(userId: string, boxId: string) {
    return new DailyLearnedBox(
      DailyLearnedBoxId.create(),
      UserId.fromString(userId),
      BoxId.fromString(boxId),
    );
  }

  getDailyLearnedBoxId() {
    return this.dailyLearnedBoxId;
  }

  getUserId() {
    return this.userId;
  }

  getBoxId() {
    return this.boxId;
  }
}
