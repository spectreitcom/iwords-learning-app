import {
  IsArray,
  IsNotEmpty,
  IsUUID,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CheckAnswerForIrregularVerbDto {
  @ApiProperty({
    description: 'Answer',
    type: 'string',
    isArray: true,
    example: ['I form', 'II form', 'III form'],
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @Transform(({ value }: { value: string[] }) =>
    value.map((form) => form.toLowerCase().trim()),
  )
  readonly answer: [string, string, string];

  @ApiProperty({
    description: 'Expression context id',
    format: 'uuid',
  })
  @IsNotEmpty()
  @IsUUID()
  readonly expressionContextId: string;
}
