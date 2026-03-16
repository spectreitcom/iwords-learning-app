import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty({
    description: 'Expression context id',
    example: '07360212-32a8-4443-85e6-905c1d683051',
  })
  @IsUUID()
  readonly expressionContextId: string;

  @ApiProperty({
    description: 'Note title',
    example: 'My Note Title',
    minLength: 3,
    maxLength: 120,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  readonly title: string;
}
