import { IsArray, Length } from 'class-validator';

export class VerbForms {
  @IsArray()
  @Length(3)
  public readonly value: [string, string, string];

  private constructor(value: [string, string, string]) {
    this.value = value;
    this.validate();
  }

  private validate() {
    if (this.value.length !== 3) {
      throw new Error('VerbForms must have 3 elements');
    }
  }

  static fromArray(value: [string, string, string]): VerbForms {
    return new VerbForms(value);
  }

  equals(verbForms: VerbForms) {
    return (
      this.value[0] === verbForms.value[0] &&
      this.value[1] === verbForms.value[1] &&
      this.value[2] === verbForms.value[2]
    );
  }
}
