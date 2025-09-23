import { IsArray, IsNotEmpty, IsUUID, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';

export class CreateIrregularVerbExpressionContextDto {
  @ApiProperty({
    description: 'Expression id',
    type: String,
    required: true,
    example: randomUUID(),
  })
  @IsNotEmpty()
  @IsUUID()
  readonly expressionId: string;

  @ApiProperty({
    description: 'Translation',
    example: 'Some translation',
    required: true,
  })
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  readonly translation: string;

  @ApiProperty({
    description: 'Forms',
    example: ['I form', 'II form', 'III form'],
    required: true,
  })
  @IsArray()
  @Length(3)
  readonly forms: [string, string, string];
}
