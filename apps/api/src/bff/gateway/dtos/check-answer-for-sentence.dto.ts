import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CheckAnswerForSentenceDto {
  @ApiProperty({
    description: 'Answer',
    format: 'string',
  })
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  readonly answer: string;

  @ApiProperty({
    description: 'Sentence id',
    format: 'uuid',
  })
  @IsNotEmpty()
  @IsUUID()
  readonly sentenceId: string;
}
