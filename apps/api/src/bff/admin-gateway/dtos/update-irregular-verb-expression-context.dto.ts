import {
  IsArray,
  IsNotEmpty,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateIrregularVerbExpressionContextDto {
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
  @ArrayMaxSize(3)
  @ArrayMinSize(3)
  @Transform(({ value }: { value: string[] }) =>
    value.map((form) => form.toLowerCase().trim()),
  )
  readonly forms: [string, string, string];
}
