import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateExpressionDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Expression phrase',
  })
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  readonly phrase: string;
}
