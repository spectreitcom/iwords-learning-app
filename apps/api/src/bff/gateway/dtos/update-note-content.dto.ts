import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNoteContentDto {
  @ApiProperty({
    description: 'Note content',
    example: 'This is the content of my note.',
  })
  @IsString()
  readonly content: string;
}
