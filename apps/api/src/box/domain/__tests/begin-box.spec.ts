import { BeginBox } from '../begin-box';
import { randomUUID } from 'node:crypto';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('BeginBox', () => {
  it('should create a BeginBox with generated BeginBoxId (UUID)', () => {
    const userId = randomUUID();
    const boxId = randomUUID();

    const beginBox = BeginBox.create(userId, boxId);

    const beginBoxId = beginBox.getBeginBoxId();
    expect(beginBoxId).toBeDefined();
    expect(beginBoxId.value).toMatch(UUID_REGEX);
  });

  it('should expose provided userId and boxId via getters', () => {
    const userId = randomUUID();
    const boxId = randomUUID();

    const beginBox = BeginBox.create(userId, boxId);

    expect(beginBox.getUserId().value).toBe(userId);
    expect(beginBox.getBoxId().value).toBe(boxId);
  });

  it('should return instances of value objects from getters', () => {
    const userId = randomUUID();
    const boxId = randomUUID();

    const beginBox = BeginBox.create(userId, boxId);

    // We cannot import types directly without coupling, so rely on shape
    expect(typeof beginBox.getBeginBoxId().value).toBe('string');
    expect(typeof beginBox.getUserId().value).toBe('string');
    expect(typeof beginBox.getBoxId().value).toBe('string');
  });

  it('should throw if userId is not a valid UUID', () => {
    const invalidUserId = 'not-a-uuid';
    const boxId = randomUUID();

    expect(() => BeginBox.create(invalidUserId, boxId)).toThrow(
      'UserId is not valid',
    );
  });

  it('should throw if boxId is not a valid UUID', () => {
    const userId = randomUUID();
    const invalidBoxId = 'not-a-uuid';

    expect(() => BeginBox.create(userId, invalidBoxId)).toThrow(
      'BoxId is not valid',
    );
  });
});
