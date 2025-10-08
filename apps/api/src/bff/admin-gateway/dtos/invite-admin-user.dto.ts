import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InviteAdminUserDto {
  @ApiProperty({
    description: 'Email',
    format: 'email',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'Name',
    example: 'John Doe',
  })
  @IsNotEmpty()
  readonly name: string;
}
