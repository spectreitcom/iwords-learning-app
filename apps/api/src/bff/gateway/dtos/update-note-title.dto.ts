import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNoteTitleDto {
  @ApiProperty({
    description: 'Note title',
    example: 'Updated Note Title',
    minLength: 3,
    maxLength: 120,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  readonly title: string;
}
