import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class GetExpressionContextsListQueryDto {
  @ApiProperty({ required: true, description: 'Expression id', default: 10 })
  @IsUUID()
  readonly expressionId: string;

  @ApiProperty({ required: false, description: 'Take count' })
  @IsOptional()
  readonly take: number = 10;

  @ApiProperty({ required: false, description: 'Page count', default: 1 })
  @IsOptional()
  readonly page: number = 1;
}
