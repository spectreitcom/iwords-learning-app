import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Token',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  readonly token: string;

  @ApiProperty({
    description: 'Password',
    example: '123456',
  })
  @IsNotEmpty()
  readonly password: string;
}
