import { IsUUID, validateSync } from 'class-validator';
import { randomUUID } from 'node:crypto';

export class BeginBoxId {
  @IsUUID()
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
    this.validate();
  }

  private validate() {
    const errors = validateSync(this);
    if (errors.length) {
      throw new Error('BeginBoxId is not valid');
    }
  }

  static create(): BeginBoxId {
    return new BeginBoxId(randomUUID());
  }

  static fromString(value: string): BeginBoxId {
    return new BeginBoxId(value);
  }

  equals(boxId: BeginBoxId) {
    return this.value === boxId.value;
  }
}
