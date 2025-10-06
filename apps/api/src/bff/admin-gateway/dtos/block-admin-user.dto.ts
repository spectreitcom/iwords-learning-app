import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BlockAdminUserDto {
  @ApiProperty({
    description: 'Admin user id to block',
    required: true,
    format: 'uuid',
  })
  @IsNotEmpty()
  @IsUUID()
  readonly adminUserId: string;
}
