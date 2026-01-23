import { BaseUuidIdentifier } from '../base-uuid-identifier';

describe('BaseUuidIdentifier', () => {
  it('should create a valid UUID', () => {
    const id = BaseUuidIdentifier.create();
    expect(id.value).toBeDefined();
    expect(typeof id.value).toBe('string');
    // Simple UUID v4 regex check
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(id.value).toMatch(uuidRegex);
  });

  it('should create from a valid string', () => {
    const validUuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const id = BaseUuidIdentifier.fromString(validUuid);
    expect(id.value).toBe(validUuid);
  });

  it('should throw an error when creating from an invalid string', () => {
    const invalidUuid = 'not-a-uuid';
    expect(() => BaseUuidIdentifier.fromString(invalidUuid)).toThrow(
      'BaseUuidIdentifier is not valid',
    );
  });

  it('should return true when comparing two identical identifiers', () => {
    const uuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const id1 = BaseUuidIdentifier.fromString(uuid);
    const id2 = BaseUuidIdentifier.fromString(uuid);
    expect(id1.equals(id2)).toBe(true);
  });

  it('should return false when comparing two different identifiers', () => {
    const id1 = BaseUuidIdentifier.create();
    const id2 = BaseUuidIdentifier.create();
    expect(id1.equals(id2)).toBe(false);
  });
});
