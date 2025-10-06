import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UnblockAdminUserDto {
  @ApiProperty({
    description: 'Admin user id to unblock',
    required: true,
    format: 'uuid',
  })
  @IsNotEmpty()
  @IsUUID()
  readonly adminUserId: string;
}
