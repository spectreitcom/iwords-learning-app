import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddItemToBoxDto {
  @ApiProperty({
    description: 'Expression context id',
    format: 'uuid',
  })
  @IsUUID()
  readonly expressionContextId: string;
}
