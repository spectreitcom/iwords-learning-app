import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBoxDto {
  @ApiProperty({
    description: 'The title of the box',
    example: 'Some title of the box',
  })
  @IsNotEmpty()
  readonly title: string;
}
