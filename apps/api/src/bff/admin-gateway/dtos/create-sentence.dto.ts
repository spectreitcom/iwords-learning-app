import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSentenceDto {
  @ApiProperty({
    description: 'Expression context id',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  readonly expressionContextId: string;

  @ApiProperty({
    description: 'Translation',
    example: 'Some translation',
    required: true,
  })
  @IsNotEmpty()
  readonly translation: string;

  @ApiProperty({
    description: 'Sentence content',
    example: 'Some sentence content',
    required: true,
  })
  @IsNotEmpty()
  readonly content: string;
}
