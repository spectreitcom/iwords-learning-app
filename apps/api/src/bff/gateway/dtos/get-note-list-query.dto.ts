import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetNoteListQueryDto {
  @ApiProperty({ required: false, description: 'Take count', default: 10 })
  @IsOptional()
  readonly take: number = 10;

  @ApiProperty({ required: false, description: 'Page count', default: 1 })
  @IsOptional()
  readonly page: number = 1;
}
