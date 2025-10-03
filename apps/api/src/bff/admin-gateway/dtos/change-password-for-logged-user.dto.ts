import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordForLoggedUserDto {
  @ApiProperty({ description: 'Existing password' })
  @IsNotEmpty()
  readonly existingPassword: string;

  @ApiProperty({ description: 'New password' })
  @IsNotEmpty()
  readonly newPassword: string;
}
