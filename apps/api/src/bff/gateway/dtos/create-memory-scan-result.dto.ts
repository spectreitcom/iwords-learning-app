import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMemoryScanResultDto {
  @ApiProperty({
    description: 'Number of remembered items',
    example: 10,
    required: true,
  })
  @IsInt()
  readonly rememberedItemsCount: number;

  @ApiProperty({
    description: 'Time taken to remember items',
    example: 10,
    required: true,
  })
  @IsInt()
  @IsPositive()
  readonly rememberingTime: number;
}
