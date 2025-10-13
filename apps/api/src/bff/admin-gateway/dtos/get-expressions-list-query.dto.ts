import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetExpressionsListQueryDto {
  @ApiProperty({ required: false, description: 'Search text' })
  @IsOptional()
  @Transform(({ value }: { value: string }) =>
    value === '' ? '' : value.toLowerCase().trim(),
  )
  readonly searchText: string;

  @ApiProperty({ required: false, description: 'Take count', default: 10 })
  @IsOptional()
  readonly take: number = 10;

  @ApiProperty({ required: false, description: 'Page count', default: 1 })
  @IsOptional()
  readonly page: number = 1;
}
