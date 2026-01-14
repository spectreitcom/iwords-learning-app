import { DailyLearnedBox } from '../daily-learned-box';
import { DailyLearnedBoxId } from '../value-objects/daily-learned-box-id';
import { UserId } from '../value-objects/user-id';
import { BoxId } from '../value-objects/box-id';

describe('DailyLearnedBox', () => {
  const userIdStr = '550e8400-e29b-41d4-a716-446655440001';
  const boxIdStr = '550e8400-e29b-41d4-a716-446655440002';

  describe('create', () => {
    it('should create a new DailyLearnedBox with generated id', () => {
      const dailyLearnedBox = DailyLearnedBox.create(userIdStr, boxIdStr);

      expect(dailyLearnedBox).toBeInstanceOf(DailyLearnedBox);
      expect(dailyLearnedBox.getDailyLearnedBoxId()).toBeInstanceOf(
        DailyLearnedBoxId,
      );
      expect(dailyLearnedBox.getUserId().value).toBe(userIdStr);
      expect(dailyLearnedBox.getBoxId().value).toBe(boxIdStr);
    });
  });

  describe('constructor', () => {
    it('should create a DailyLearnedBox with provided parameters', () => {
      const dailyLearnedBoxId = DailyLearnedBoxId.create();
      const userId = UserId.fromString(userIdStr);
      const boxId = BoxId.fromString(boxIdStr);

      const dailyLearnedBox = new DailyLearnedBox(
        dailyLearnedBoxId,
        userId,
        boxId,
      );

      expect(dailyLearnedBox.getDailyLearnedBoxId()).toBe(dailyLearnedBoxId);
      expect(dailyLearnedBox.getUserId()).toBe(userId);
      expect(dailyLearnedBox.getBoxId()).toBe(boxId);
    });
  });

  describe('getters', () => {
    it('should return correct dailyLearnedBoxId', () => {
      const dailyLearnedBoxId = DailyLearnedBoxId.create();
      const dailyLearnedBox = new DailyLearnedBox(
        dailyLearnedBoxId,
        UserId.fromString(userIdStr),
        BoxId.fromString(boxIdStr),
      );

      expect(dailyLearnedBox.getDailyLearnedBoxId()).toBe(dailyLearnedBoxId);
    });

    it('should return correct userId', () => {
      const userId = UserId.fromString(userIdStr);
      const dailyLearnedBox = new DailyLearnedBox(
        DailyLearnedBoxId.create(),
        userId,
        BoxId.fromString(boxIdStr),
      );

      expect(dailyLearnedBox.getUserId()).toBe(userId);
    });

    it('should return correct boxId', () => {
      const boxId = BoxId.fromString(boxIdStr);
      const dailyLearnedBox = new DailyLearnedBox(
        DailyLearnedBoxId.create(),
        UserId.fromString(userIdStr),
        boxId,
      );

      expect(dailyLearnedBox.getBoxId()).toBe(boxId);
    });
  });
});
