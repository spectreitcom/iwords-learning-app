import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ValidateSentenceUsingAiDto {
  @ApiProperty({
    description: 'Expression context id',
    format: 'uuid',
  })
  @IsUUID()
  readonly expressionContextId: string;

  @ApiProperty({
    description: 'User sentence',
    example: 'Some sentence',
  })
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  readonly userSentence: string;
}
