import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendAdminInvitationEmailDto {
  @ApiProperty({
    description: 'Admin user id',
    format: 'uuid',
  })
  @IsUUID()
  readonly adminUserId: string;
}
