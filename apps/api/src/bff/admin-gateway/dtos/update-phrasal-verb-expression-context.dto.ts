import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePhrasalVerbExpressionContextDto {
  @ApiProperty({
    description: 'Translation',
    example: 'Some translation',
    required: true,
  })
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  readonly translation: string;
}
