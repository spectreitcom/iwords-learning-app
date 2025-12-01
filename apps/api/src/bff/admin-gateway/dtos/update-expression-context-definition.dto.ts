import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateExpressionContextDefinitionDto {
  @ApiProperty({ description: 'Definition' })
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  readonly definition: string;

  @ApiProperty({ description: 'Definition' })
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  readonly definitionTranslation: string;
}
