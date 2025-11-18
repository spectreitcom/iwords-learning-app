import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  readonly userSentence: string;
}
