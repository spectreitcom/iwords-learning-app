import { IsUUID, validateSync } from 'class-validator';
import { randomUUID } from 'node:crypto';

export class BoxId {
  @IsUUID()
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length) {
      throw new Error('BoxId is not valid');
    }
  }

  static create(): BoxId {
    return new BoxId(randomUUID());
  }

  static fromString(value: string): BoxId {
    return new BoxId(value);
  }

  equals(boxId: BoxId) {
    return this.value === boxId.value;
  }
}
