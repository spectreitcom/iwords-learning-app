import { DailyLearnedBoxId } from '../daily-learned-box-id';
import { isUUID } from 'class-validator';

describe('DailyLearnedBoxId', () => {
  describe('create', () => {
    it('should create a valid DailyLearnedBoxId with a random UUID', () => {
      const dailyLearnedBoxId = DailyLearnedBoxId.create();

      expect(dailyLearnedBoxId).toBeInstanceOf(DailyLearnedBoxId);
      expect(isUUID(dailyLearnedBoxId.value)).toBe(true);
    });
  });

  describe('fromString', () => {
    it('should create a DailyLearnedBoxId from a valid UUID string', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const dailyLearnedBoxId = DailyLearnedBoxId.fromString(uuid);

      expect(dailyLearnedBoxId).toBeInstanceOf(DailyLearnedBoxId);
      expect(dailyLearnedBoxId.value).toBe(uuid);
    });

    it('should throw an error if the provided string is not a valid UUID', () => {
      const invalidUuid = 'not-a-uuid';

      expect(() => DailyLearnedBoxId.fromString(invalidUuid)).toThrow(
        'DailyLearnedBoxId is not valid',
      );
    });
  });

  describe('equals', () => {
    it('should return true if two DailyLearnedBoxIds have the same value', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const id1 = DailyLearnedBoxId.fromString(uuid);
      const id2 = DailyLearnedBoxId.fromString(uuid);

      expect(id1.equals(id2)).toBe(true);
    });

    it('should return false if two DailyLearnedBoxIds have different values', () => {
      const id1 = DailyLearnedBoxId.create();
      const id2 = DailyLearnedBoxId.create();

      expect(id1.equals(id2)).toBe(false);
    });
  });
});
