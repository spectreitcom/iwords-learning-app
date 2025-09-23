import { IsBoolean, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNounExpressionContextDto {
  @ApiProperty({
    description: 'Translation',
    example: 'Some translation',
    required: true,
  })
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  readonly translation: string;

  @ApiProperty({
    description: 'Is countable',
    example: true,
    required: true,
  })
  @IsBoolean()
  readonly isCountable: boolean;
}
