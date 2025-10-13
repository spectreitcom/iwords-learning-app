import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UnblockUserDto {
  @ApiProperty({
    description: 'User id to block',
    required: true,
    format: 'uuid',
  })
  @IsNotEmpty()
  @IsUUID()
  readonly userId: string;
}
