import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateSentenceDto {
  @ApiProperty({
    description: 'Translation',
    example: 'Some translation',
    required: true,
  })
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  readonly translation: string;

  @ApiProperty({
    description: 'Sentence content',
    example: 'Some sentence content',
    required: true,
  })
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  readonly content: string;
}
